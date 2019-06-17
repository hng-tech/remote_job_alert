/*jshint esversion: 8 */

const db = require("./promise").Db;
const validateQueryText = require("../validation/controller");
const fetch = require("node-fetch");
const {
  sendMailForRemoteJob
} = require("./user");
const userModel = require("../models/user");
const preferenceModel = require("../models/preferences")
const validateRegisteredUser = require("../validation/registeredUser");
const registeredUsers = require("../models/registeredUsers");
const agentModel = require("../models/newAgent");
const paymentModel = require("../models/payment");
const Paystack = require('./paystack');
const session = require('./stripe');
const Applicant = require('./applicant');

// Null placeholder till promise returns a value
var remote_jobs = null;

// trick function to store Promise value
function load_data(data) {
  remote_jobs = data;
}

//Create more beautiful slugs, we all need good things...
function slugify(element) {
  let title = element.title;
  let company = element.company;
  let regex = /[\.\-\]\[\(\)\!\,\<\>\`\~\{\}\?\/\\\"\:\'\|\@\%\&\*]/g;
  let urlOne = title.toLowerCase().trim().replace(regex, '').split(' ');
  let urlTwo = company.toLowerCase().trim().replace(regex, '').split(' ');
  let custom_url = urlOne.join('-') + '-' + urlTwo.join('-')

  return custom_url
}

// Get all the data
const getData = async () => {
  try {
    const response = await fetch("https://jobs.github.com/positions.json?location=remote");
    const json = await response.json();
    
    // Parse and produce unique slug -- custom-url
    json.forEach(element => {
      element.custom_url = slugify(element);
    });

    // sneak and load up our global variable
    load_data(json);

  } catch (error) {
    // catch @Prismatic. He's an error
    console.log(error);
  }
};

// fire! Promise fire!
getData();

// searches for common needles in a an array. Don't touch
function search_common(needle, haystack) {
  let key_languages = "";
  for (let i = 0, n = haystack.length; i < n; i++) {
    if (needle.includes(haystack[i])) {
      key_languages += haystack[i] + ", ";
    }
  }
  return key_languages;
}
//Algo for deriving a stack job by checking if the desc includes the tech passed to the param.
//This has a lesser running time than the previous one
function searchTech(stack, searchArray, pushArray) {

  for (j = 0; j<searchArray.length; j++) {
    let arrayDesc = searchArray[j].description.toLowerCase();
    if (arrayDesc.includes(stack)) {
      let lastIndex = arrayDesc.indexOf(stack) + (stack.length);
      let lastString = arrayDesc[lastIndex];
      let firstIndex = arrayDesc.indexOf(stack) - 1;
      let firstString = arrayDesc[firstIndex];
      let regex = "./j [](),{}:;'-|!";
      //Check if the string being searched is standalone or ends/starts with any of the regex components, and yes, I know that's not actual regex
      //See me thinking the thing was not working before
      if(regex.includes(firstString) && regex.includes(lastString) && !(pushArray.includes(searchArray[j]))) {
          pushArray.push(searchArray[j]);
          continue;
      }
      else {
        continue;
      }
    }
  }
  return pushArray;
}



const Jobs = {
  async fetchData(req, res) {
    
    let main = JSON.parse(JSON.stringify(remote_jobs));

    if (req.query.country) {
      const search = main.filter((country) => {
        return country.location.indexOf(req.query.country) > -1;
        // country.location = country.location.split(/,|;|-|\//);
        // return _.includes(country.location, req.query.country);
      });
      return res.status(200).send(search);
    }
    return res.status(200).json(main);
  },

  async create_registered_user(req, res) {
		const { errors, isValid } = validateRegisteredUser(req.body);

		// Check Validation
		if (!isValid) {
			return res.status(400).json(errors);
		}

		const queryText = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			phone_number: req.body.phone_number,
			prefered_job_role: req.body.prefered_job_role,
			prefered_job_level: req.body.prefered_job_level,
			prefered_job_type: req.body.prefered_job_type,
			prefered_job_location: req.body.prefered_job_location,
			prefered_job_stack: req.body.prefered_job_stack,
			prefered_update_type: req.body.prefered_update_type,
			prefered_update: req.body.prefered_update,
			created_At: Date.now()
		};
		try {
			let user = await registeredUsers.create(queryText);
			return res.status(200).json({
				status: 'success',
				message: user,
			});
		} catch (error) {
			return res.status(500).send(error);
		}
	},

  async view_all_registered_users(req, res) {
    try {
      let users = await registeredUsers.find();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async update_registered_user(req, res) {
    const { _id } = req.params;
		const { errors, isValid } = validateRegisteredUser(req.body);

		// Check Validation
		if (!isValid) {
			return res.status(400).json(errors);
		}

		const queryText = {
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			phone_number: req.body.phone_number,
			prefered_job_role: req.body.prefered_job_role,
			prefered_job_level: req.body.prefered_job_level,
			prefered_job_type: req.body.prefered_job_type,
			prefered_job_location: req.body.prefered_job_location,
			prefered_job_stack: req.body.prefered_job_stack,
			prefered_update_type: req.body.prefered_update_type,
			prefered_update: req.body.prefered_update,
			created_At: Date.now()
		};
		try {

			let user = await registeredUsers.findOneAndUpdate(_id, queryText)
			return res.status(200).json({
				status: 'success',
				message: user,
			});
		} catch (error) {
			return res.status(500).send(error);
		}
	},

  async fetchPreferredJobs(req, res) {
    try {
    let id = req.params._id; 
    if (typeof id == "undefined")
        id = "5ccef761e415f84678d393f1";
    let registeredUser = await registeredUsers.findById(id);
    if (registeredUser != null) {
      let RoleData = ["App Developer", "Database Administrator", "Programmer", "Software Developer", "Web Developer"];
      let LevelData = ["Junior", "Intermediate", "Semior","Intern"]
      let TypeData = ["Part time", "Full time", "Remote", "Part time remote"];
      let LocationData = await fetch(`https://gist.githubusercontent.com/Shock451/53fe61b951f809f8fa91bab6c490aae4/raw/ce8f86dd5606dc59fd966e82ac804580f75082ac/countries.json`);
      let StackData = await fetch(`https://gist.githubusercontent.com/Shock451/4a14fc459f411b0fbbeeb62f6a7ad297/raw/284e5bedbb84ef15f79add3384a2375163d89535/languages.json`);
      let Locations = await LocationData.json();
      let Stacks = await StackData.json();
      //let TotalJobs = RoleJobs.concat(LevelJobs, TypeJobs, LocationJobs, StackJobs);
    // sendPreferedMailForRemoteJob(RoleJobs, registeredUser);

    
      return res.status(200).render("jobPreference", {
        RoleData,
        LevelData,
        TypeData,
        Locations: Locations.countries,
        Stacks: Stacks.languages,
        user: (typeof req.session.user == 'undefined') ? null : req.session.user
      });
    }
      return res.status(400).json({
        status: "invalid input",
        message: "no such user",
      });
    }
    catch (error) {
      console.log(error)
      return res.status(400).send(error);
    }
  },

  async setPreferences(req, res) {

    const queryText = {
      _id: req.session.user._id
    };

    let existing_preferences = [];

    let stacks = ["c", "android", "asp", "cplusplus", "java", "javascript", "linux", "node", "php", "python", "react", "ruby", "sql"];

    let types = ["full-time", "part-time", "contract"];

    let frequencies = ["daily", "weekly", "monthly"];

    try {
      existing_preferences = await preferenceModel.findOne(queryText);
      if (!existing_preferences) {
        // create new prefs for user
        const createText = {
          _id: req.session.user._id,
          stacks: [], 
          job_types: [], 
          mail_frequency: "daily" // by default
        };

        let createdPreferences = await preferenceModel.create(createText);
        if (!createdPreferences)
          res.status(400).redirect("/");
        existing_preferences = createdPreferences;
      }
    } catch (err) {
      throw (err)
    }

    res.render("jobPreference.hbs", {
      user: (typeof req.session.user == 'undefined') ? null : req.session.user,
      job_types: existing_preferences.job_types,
      stacks: existing_preferences.stacks,
      frequency: existing_preferences.mail_frequency,
      helpers:
      {
        // this helps with displaying the page links, I guess
        populate_stacks: function () {
          parsedhtml = "";
          for (let i = 0; i < stacks.length; i++) {
            parsedhtml += `
            <li>
              <input type="checkbox" id="stackbox${i}" value="${stacks[i]}" ${(existing_preferences.stacks.includes(stacks[i])) ? "checked" : ""}>
              <label for="stackbox${i}">
                ${stacks[i]}
              </label>
            </li>`;
          }
          return parsedhtml;
        },
        populate_types: function () {
          parsedhtml = "";
          for (let i = 0; i < types.length; i++) {
            parsedhtml += `
            <li>
              <input type="checkbox" id="typebox${i}" value="${types[i]}" ${(existing_preferences.job_types.includes(types[i])) ? "checked" : ""}>
              <label for="typebox${i}">
                ${types[i]}
              </label>
            </li>`;
          }
          return parsedhtml;
        },
        show_frequencies: function () {
          parsedhtml = "";
          for (let i = 0; i < frequencies.length; i++) {
            parsedhtml += `
            <div class="radiobtn">
              <input type="radio" id="${frequencies[i]}" ${(existing_preferences.mail_frequency == frequencies[i]) ? "checked" : ""} name="drone" value="${frequencies[i]}" />
              <label for="${frequencies[i]}">${frequencies[i]}</label>
            </div>`;
          }
          return parsedhtml;
        },

      }
    });
  },

  async updatePreferences(req, res) {
    let data = req.body;
    const queryText = {
      _id: req.session.user._id
    };
    const updateText = {
      id: req.session.user._id,
      stacks: data.stacks,
      job_types: data.categories,
      mail_frequency: data.frequency
    };
    try {
      let updatedPreferences = await preferenceModel.findOneAndUpdate(queryText, updateText);
      return res.status(200).send();
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async fetchHomeJobs(req, res) {
    //There should be a function for getting latest jobs
    //There should be a function for getting number of jobs per stack and an object oriented array that does the mapping
    //
    let main = JSON.parse(JSON.stringify(remote_jobs));

    //Ensure only jobs with images are displayed on the homepage
    let newMain = [];

    main.forEach(job => {
      if (job.company_logo !== null && job.company_logo !== "") {
        newMain.push(job);
      }
      
    });

    //Latest jobs, taken by removing the latest six from the json
    let latestJobs = newMain.slice(0,6);
    const stripeSession = await session;

    //Array of the stacks to be used and the links to their images
    let stackJobs = [{"tech":"python","logo":'https://img.icons8.com/color/50/python.svg'},{"tech":'javascript',"logo":'https://img.icons8.com/color/50/javascript.svg'},{"tech":"php","logo":'https://img.icons8.com/dusk/50/000000/php-logo.png'},{"tech":'ios',"logo":'https://img.icons8.com/color/50/ios-logo.svg'},{"tech":'c++',"logo":'https://img.icons8.com/color/50/000000/c-plus-plus-logo.png'},{"tech":'react',"logo":'https://img.icons8.com/ios/50/000000/react-native-filled.png'}];

    let allTechJobs = [[],[],[],[],[],[]];
  
    stackJobs.forEach(element => {
      stackJobs[stackJobs.indexOf(element)].count = searchTech(element.tech,main,allTechJobs[stackJobs.indexOf(element)]).length;
      if (element.tech.length == 3) {
        stackJobs[stackJobs.indexOf(element)].formalName = element.tech.toUpperCase();
      }
      else {
        stackJobs[stackJobs.indexOf(element)].formalName = element.tech.charAt(0).toUpperCase() + element.tech.slice(1);
      } 
    });

    
    //It goes something like this: allTechJobs[tech] = searchTech()
    //Then I can do something like for number of java jobs I have allTechJobs[java].length 

    return res.status(200).render('index', {
      stackJobs : stackJobs,
      latestJobs: latestJobs,
      sessionId: stripeSession.id,
      user: (typeof req.session.user == 'undefined') ? null : req.session.user,
    })
  },

  async fetchSingle(req, res) {

    let slug = req.params.slug
    let single_job = null;
    let main = JSON.parse(JSON.stringify(remote_jobs));

    //Array containing potential slugs
    let techs = ['python','php','javascript','java','ios','devops','c++','node','asp','react','android','linux','sql','ruby'];
    let categories = ['full-time','part-time','contract'];

    //Check for the type of the param being passed, a tech, a category or a custom URL
      if(techs.includes(slug)) {
        try {
          let tech = slug;
          let formalTech = "";
      
          //For proper rendering of PHP, IOS and SQL jobs. Basically all jobs with three letters
          if (tech.length == 3) {
            formalTech = tech.toUpperCase();
          }
          else {
            formalTech = tech.charAt(0).toUpperCase() + tech.slice(1);
          } 
          let allStackJobsNull = [];
          let allStackJobs = searchTech(tech, main, allStackJobsNull);

          //For jobs without an image
          allStackJobs.slice().map(function (job) {
            job.company_logo = (!job.company_logo) ? "/images/no_job_image.jpg" : job.company_logo;
            return job;
          });
          return res.status(200).render('jobStack', {
            name: formalTech,
            status: 'success',
            TotalJobs: Object.keys(allStackJobs).length,
            data: allStackJobs,
            user: (typeof req.session.user == 'undefined') ? null : req.session.user
          });
    
        } catch (error) {
          return res.status(400).send(error);
        } 
      }
      else if (categories.includes(slug)) {
        try {
          //Refine the slugs for effective searching, remove the hyphens and capitalize each word
          if (slug.includes('-')) {
            let newSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
            let oldSlug = newSlug.split('-');
            oldSlug[1] = oldSlug[1].charAt(0).toUpperCase() + oldSlug[1].slice(1);
            var formalSlug = oldSlug.join(' ');
          }
          else {
            var formalSlug = slug.charAt(0).toUpperCase() + slug.slice(1);
          }

          //Now Check if the query string has values
          if (typeof req.query.tech == "undefined") {
            let allCategoryJobs = [];
            
      
            //Same algo as above...
            for (let i = 0; i < main.length; i++){
              if (main[i].type == formalSlug) {
                allCategoryJobs.push(main[i]);
                continue;
              }
            };
            
            //Jobs with no images
            allCategoryJobs.slice().map(function (job) {
              job.company_logo = (!job.company_logo) ? "/images/no_job_image.jpg" : job.company_logo;
              return job;
            });
            return res.status(200).render('jobCategory', {
              name: formalSlug,
              status: 'success',
              TotalJobs: Object.keys(allCategoryJobs).length,
              data: allCategoryJobs,
              user: (typeof req.session.user == 'undefined') ? null : req.session.user
            });
          }
          else {
            //If it has values, grab the values
            let query = req.query.tech;
            let selectedTech = query.split('|');
            if (selectedTech.includes('cplusplus')) {
              let index = selectedTech.indexOf('cplusplus');
              selectedTech.splice(index,0,'c++');
            }
            let categoryArray = [];
            let selectedJobs = [];

            main.forEach(job => {
              if (job.type == formalSlug) {
                categoryArray.push(job);
              }
            });

            selectedTech.forEach(tech => {
              //Such a blessed function, makes life easier
              searchTech(tech,categoryArray,selectedJobs);
            })

            selectedJobs.slice().map(function (job) {
              job.company_logo = (!job.company_logo) ? "/images/no_job_image.jpg" : job.company_logo;
              return job;
            });

            return res.status(200).render('jobCategory', {
              name: formalSlug,
              tech: selectedTech,
              status: 'success',
              TotalJobs: Object.keys(selectedJobs).length,
              data: selectedJobs,
              user: (typeof req.session.user == 'undefined') ? null : req.session.user
            });

          }
    
        } catch (error) {
          return res.status(400).send(error);
        }
      }
      else {
        //@Ayo, now your watch begins...
        try {
          
          for (let i = 0; i < main.length; i++){
            if (slug == main[i].custom_url) {
              single_job = main[i];
              break;
            }
          };
    
          let common_tech = ["python", "es6", "ruby", "c#", "java ", " C ", "c++", "php", "javascript", "css", "html", "swift", "git", "azure", "docker", "sql", "asp.net", ".net", "asp", "rest", "react", "ios", "android", "vagrant", "trello", " R ", "Linux", "Angular", "Node"];
    
          let key_tech = search_common(single_job.description.toLowerCase(), common_tech);
    
          let sortquery = key_tech.trim().split(", ");
    
          for (let i = 0; i < sortquery.length; i++){
            main.sort(function (a, b) {
              var A = a.description, B = b.description;
              if (A.includes(sortquery[i])) {
                return 1;
              } else if (B.includes(sortquery[i])) {
                return -1;
              }
            });
          }
    
          let sub_data = main.filter(function (job) {
            if (job.id !== single_job.id) {
              job.company_logo = (!job.company_logo) ? "/images/no_job_image.jpg" : job.company_logo;
              let custom_url = slugify(job);
              job.custom_url = custom_url;
              return job;
            }
          }).slice(0, 3);
    
          let summary = single_job.description.slice(0, single_job.description.indexOf("</p>", 100));
    
          single_job.description = single_job.description.slice(summary.length);
    
          const stripeSession = await session;
    
          // some jobs have no image
          single_job.company_logo = (!single_job.company_logo) ? "/images/no_job_image.jpg" : single_job.company_logo;
    
          return res.status(200).render('singleJob', {
            content: single_job,
            summary: summary,
            keytech: key_tech + "...",
            title: single_job.title,
            similar_jobs: sub_data,
            sessionId: stripeSession.id,
            user: (typeof req.session.user == 'undefined') ? null : req.session.user
          })
        } 
        catch (error) 
        {
          return res.status(400).send(error);
        }
      }

      
  },
  async get_api_jobs(req, res) {

    let main = JSON.parse(JSON.stringify(remote_jobs));

    main.slice().map(function (job) {
      job.company_logo = (!job.company_logo) ? "/images/no_job_image.jpg" : job.company_logo;
      return job;
    });

    // So your narcissistic a$$ can change it easily
    let jobs_per_page = 7;

    // calculates the number of pages we can get if we have a specified no of jobs per page
    let pages = Math.ceil(main.length / jobs_per_page);

    // page requested by user | Undefined on landing to /jobs
    let page = (typeof req.query.page == "undefined") ? 1 : parseInt(req.query.page);

    // where to slice the array of jobs from - for the page
    let start_offset = (page * jobs_per_page) - jobs_per_page;

    // when to stop slicing $h*t
    let end_offset = start_offset + jobs_per_page;

    // well, you gotta return something ya'know
    return res.status(200).render('jobPage', {
      // main shii we're delivering, after slicing of course
      content: main.slice(start_offset, end_offset),

      user: (typeof req.session.user == 'undefined') ? null : req.session.user,
      // Next and previous buttons should not always show
      buttons: {
        previous: (page === 1) ? false : page - 1,
        next: (page === pages) ? false : page + 1,
      },


      // we all need helpers. Baba God hear me out
      helpers: 
      {
        // this helps with displaying the page links, I guess
        populate_links: function () {
          links = "";
          for (let i = 0; i < pages; i++) {
            if (page == i + 1)
              links += `<li class="page-item active"><a class="page-link" href="jobs?page=${i + 1}">${i + 1}</a></li>`
            else
              links += `<li class="page-item"><a class="page-link" href="jobs?page=${i + 1}">${i + 1}</a></li>`
          }
          return links;
        },
      }
    });
  },

  //Do not Touch - Used by Featured Jobs
  //Update: I touched this and there's nothing you can do about it :)
  async create(req, res, next) {
    // // Check Validation
    // if (!isValid) {
    //  return res.status(400).json(errors);
    // }

    const queryText = {
      company_name: req.body.company_name,
      job_title: req.body.job_title,
      job_link: req.body.job_link,
      employer_email: req.body.email,
      slug: req.body.slug,
      job_stack: req.body.job_stack,
      job_pay_min: req.body.minimum_salary,
      job_pay_max: req.body.maximum_salary,
      job_type: req.body.job_type,
      location: req.body.location,
      job_description: req.body.job_description,
      image_link: req.body.image_link
    };
    try {
      let createdJob = await db.create(queryText);
     // sendMailForRemoteJob(createdJob);
      return res.status(201).redirect("/admin/managejobs");
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async get_all(req, res) {
    const queryText = {};
    try {
      let data = await fetch("https://jobs.github.com/positions.json?location=remote");
      let foundJobs = await data.json();
      let usersCount = await userModel.countDocuments({});
      let agentsCount = await agentModel.countDocuments({});
      let paymentsCount = await paymentModel.countDocuments({});
      return res.status(200).render("admin_dashboard", {
        content: foundJobs,
        jobCount: foundJobs.length,
        usersCount,
        agentsCount,
        paymentsCount,
        user: (typeof req.session.user == 'undefined') ? null : req.session.user,
        helpers: {
          inc: function (index) {
            index++;
            return index;
          },
          limit: function (arr, limit) {
            if (!Array.isArray(arr)) { return []; }
            return arr.slice(0, limit);
          }

        }
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  async get_all_json(req, res) {
    const queryText = {};
    try {
      let foundJobs_Json = await db.find(queryText);
      return res.status(200).json(foundJobs_Json);
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  async get_one(req, res) {
    const queryText = {
      slug: req.params.slug
    };
    try {

      let foundJob = await db.findOne(queryText);

      let summary = foundJob.job_description.slice(0, foundJob.job_description.indexOf("</p>", 100));
    
      foundJob.job_description = foundJob.job_description.slice(summary.length);
    
      const stripeSession = await session;
    
      // some jobs have no image
      foundJob.image_link = (!foundJob.image_link) ? "/images/no_job_image.jpg" : foundJob.image_link;

      return res.status(200).render("singleFeaturedJob", {
        content: foundJob,
        sessionId: stripeSession.id,
        summary: summary,
        user: (typeof req.session.user == 'undefined') ? null : req.session.user
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async get_all_featured(req, res){
    const queryText = {};

    try {
      let foundFeaturedJobs = await db.find(queryText);
      return res.status(200).render("manage_featured_jobs",{
        content: foundFeaturedJobs,
        user: (typeof req.session.user == 'undefined') ? null : req.session.user,
        helpers: {
          inc: function (index) {
            index++;
            return index;
          },
          limit: function (arr, limit) {
            if (!Array.isArray(arr)) { return []; }
            return arr.slice(0, limit);
          }

        }
        
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async get_one_json(req, res) {
    const queryText = {
      _id: req.params.job_id
    };
    try {
      let foundJob = await db.findOne(queryText);
      return res.status(200).json(foundJob);
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  async update_job(req, res) {
    const queryText = {
      _id: req.params.job_id
    };

    const {
      errors,
      isValid
    } = validateQueryText(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const updateText = {
      company_name: req.body.company_name,
      job_title: req.body.job_title,
      job_link: req.body.job_link,
      employer_email: req.body.email,
      job_pay_min: req.body.minimum_salary,
      job_pay_max: req.body.maximum_salary,
      career_level: req.body.career_level,
      location: req.body.location,
      job_description: req.body.job_description,
      image_link: req.body.image_link
    };
    try {
      let updatedJob = await db.findOneAndUpdate(queryText, updateText);
      console.log(updatedJob);
      return res.status(201).redirect("/managejobs");
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  async cancel_job(req, res) {
    const queryText = {
      _id: req.params.job_id
    };
    try {
      let foundJob = await db.findOneAndDelete(queryText);
      console.log(foundJob);
      return res.status(200).redirect("/managejobs");
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  // API to return all countries and their slug for use in filtering
  async fetchCountries(req, res) {
    try {
      const countries = await fetch('https://restcountries.eu/rest/v2/all');
      const json = await countries.json();
      const countryNames = await json.map(country => {
        return {
          name: country.name,
          slug: country.alpha3Code
        };
      });
      return res.status(200).send({
        message: 'Countries returned successfully',
        data: countryNames,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },

  //Unused for now, Please do not touch
  async fetchAllSearchJobs(req, res) {
    try {
      let all = await fetch(`https://jobs.github.com/positions.json?location=remote`)
      let allJobs = await all.json();
      return res.status(200).send({
        status: 'success',
        TotalJobs: Object.keys(allJobs).length,
        data: allJobs
      });

    } catch (error) {
      return res.status(400).send(error);
    }
  },

  //Unused for now, Please do not touch
  async fetchAllFullTimeSearchJobs(req, res) {
    try {
      let main = JSON.parse(JSON.stringify(remote_jobs));
      let allFullTimeJobs = [];

      for (let i = 0; i < main.length; i++) {
        if (main[i].type == "Full Time" || main[i].description.toLowerCase().includes("full time") ) {
          allFullTimeJobs.push(main[i]);
          continue;
        }
      };


      allFullTimeJobs.slice().map(function (job) {
        job.company_logo = (!job.company_logo) ? "/images/no_job_image.jpg" : job.company_logo;
        return job;
      });
      return res.status(200).render('jobCategory', {
        name: "Full Time",
        status: 'success',
        TotalJobs: Object.keys(allFullTimeJobs).length,
        data: allFullTimeJobs,
        user: (typeof req.session.user == 'undefined') ? null : req.session.user
      });

    } catch (error) {
      return res.status(400).send(error);
    }
  },

  //Unused for now, Please do not touch
  async fetchAllPartTimeSearchJobs(req, res) {
    try {
      let main = JSON.parse(JSON.stringify(remote_jobs));
      let allPartTimeJobs = [];

      for (let i = 0; i < main.length; i++) {
        if (main[i].description.toLowerCase().includes("part time") ) {
          allPartTimeJobs.push(main[i]);
          continue;
        }
      };

      allPartTimeJobs.slice().map(function (job) {
        job.company_logo = (!job.company_logo) ? "/images/no_job_image.jpg" : job.company_logo;
        return job;
      });
      return res.status(200).render('jobCategory', {
        name: "Part Time",
        status: 'success',
        message: "Sorry, there are no jobs available for this selected category",
        TotalJobs: Object.keys(allPartTimeJobs).length,
          data: allPartTimeJobs,
          user: (typeof req.session.user == 'undefined') ? null : req.session.user
        });

    } catch (error) {
      return res.status(400).send(error);
    }
  }, 

  //Unused for now, Please do not touch
  async fetchAllContractSearchJobs(req, res) {
    try {
      let main = JSON.parse(JSON.stringify(remote_jobs));
      let allContractJobs = [];

      for (let i = 0; i < main.length; i++){
        if (main[i].type == "Contract" || main[i].description.toLowerCase().includes("contract") ) {
          allContractJobs.push(main[i]);
          continue;
        }
      };

      allContractJobs.slice().map(function (job) {
        job.company_logo = (!job.company_logo) ? "/images/no_job_image.jpg" : job.company_logo;
        return job;
      });
      return res.status(200).render('jobCategory', {
        name: "Contract",
        status: 'success',
        TotalJobs: Object.keys(allContractJobs).length,
        data: allContractJobs,
        user: (typeof req.session.user == 'undefined') ? null : req.session.user
      });

    } catch (error) {
      return res.status(400).send(error);
    }
  },

  //Unused for now, Please do not touch
  async fetchAllCustomSearchJobs(req, res) {
    const { search } = req.params; 
    try {
      let allCustom = await fetch(`https://jobs.github.com/positions.json?search=${search}&location=remote`)
      let allCustomJobs = await allCustom.json();
      return res.status(200).send({
        status: 'success',
        TotalJobs: Object.keys(allCustomJobs).length,
        data: allCustomJobs
      });

    } catch (error) {
      return res.status(400).send(error);
    }
  },
};

  

module.exports = Jobs;