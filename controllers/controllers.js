const db = require("./promise").Db;
const validateQueryText = require("../validation/controller");
const fetch = require("node-fetch");
const {
  sendMailForRemoteJob
} = require("./user");
const userModel = require("../models/user");
const validateRegisteredUser = require("../validation/registeredUser");
const registeredUsers = require("../models/registeredUsers");
const agentModel = require("../models/newAgent");
const paymentModel = require("../models/payment");
const Paystack = require('./paystack');
const session = require('./stripe');
const Applicant = require('./applicant');

const Jobs = {
  async fetchData(req, res) {
    let data = await fetch("https://jobs.github.com/positions.json?location=remote");
    let main = await data.json();
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
    const { _id } = req.params; 
    let registeredUser = await registeredUsers.findOne({ _id: _id });
    if (registeredUser != null) {
      let RoleData = await fetch(`https://jobs.github.com/positions.json?description=${registeredUser.prefered_job_role}&location=remote`);
      let LevelData = await fetch(`https://jobs.github.com/positions.json?description=${registeredUser.prefered_job_level}&location=remote`);
      let TypeData = await fetch(`https://jobs.github.com/positions.json?description=${registeredUser.prefered_job_type}&location=remote`);
      let LocationData = await fetch(`https://jobs.github.com/positions.json?description=${registeredUser.prefered_job_location}&location=remote`);
      let StackData = await fetch(`https://jobs.github.com/positions.json?description=${registeredUser.prefered_job_stack}&location=remote`);
      let RoleJobs = await RoleData.json();
      let LevelJobs = await LevelData.json();
      let TypeJobs = await TypeData.json();
      let LocationJobs = await LocationData.json();
      let StackJobs = await StackData.json();
      let TotalJobs = RoleJobs.concat(LevelJobs, TypeJobs, LocationJobs, StackJobs);
    // sendPreferedMailForRemoteJob(RoleJobs, registeredUser);

      return res.status(200).json({
        TotalRoleJobs:  Object.keys(RoleJobs).length,
        TotalLevelJobs:  Object.keys(LevelJobs).length,
        TotalTypeJobs:  Object.keys(TypeJobs).length,
        TotalLocationJobs:  Object.keys(LocationJobs).length,
        TotalStackJobs:  Object.keys(StackJobs).length,
        TotalJobsCount:  Object.keys(TotalJobs).length,
        RoleJobs: RoleJobs,
        LevelJobs: LevelJobs,
        TypeJobs: TypeJobs,
        LocationJobs: LocationJobs,
        StackJobs: StackJobs,
        TotalJobs: TotalJobs,
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

  async fetchPreferredJobs2(req, res) {
    try {
    const { _id } = req.params; 
    let registeredUser = await registeredUsers.findOne({ _id: _id });
    let pr = registeredUser.prefered_job_role;
    let ple = registeredUser.prefered_job_level;
    let pt = registeredUser.prefered_job_type;
    let plo = registeredUser.prefered_job_location;
    let ps = registeredUser.prefered_job_stack;
    let array = pr.split(',');
    let array2 = ple.split(',');
    let array3 = pt.split(',');
    let array4 = plo.split(',');
    let array5 = ps.split(',');
    console.log(array);
    console.log(array2);
    console.log(array3);
    console.log(array4);
    console.log(array5);
    for(let i=0;i<array.length; i++)
    for(let i=0;i<array2.length; i++)
    for(let i=0;i<array3.length; i++)
    for(let i=0;i<array4.length; i++)
    for(let i=0;i<array5.length; i++)
    await  fetch(`https://jobs.github.com/positions.json?description=${array[i]}&location=remote`)
    .then(response => {
      const Found = async function (response){
        try {
          let F =  await  fetch(`https://jobs.github.com/positions.json?description=${array[i]}&location=remote`)
          let RoleResult= await F.json();
          console.log(RoleResult[0].type)  
          console.log(Object.keys(RoleResult).length)  
          let Ds =  await  fetch(`${F.url}`)
        } catch (error) {
          console.log(error)
        } 
      }
      let G = Found();
      console.log(Found);
      }).then(response1 => {
          const Found1 = async function (response){
            try {
              let F =  await  fetch(`https://jobs.github.com/positions.json?description=${array2[i]}&location=remote`)
              let RoleResult= await F.json();
              console.log(RoleResult[0].type)  
            console.log(Object.keys(RoleResult).length)
            } catch (error) {
              console.log(error)
            } 
          }
          Found1();
        }).then(response2 => {
            const Found2 = async function (response){
              try {
                let F =  await  fetch(`https://jobs.github.com/positions.json?description=${array3[i]}&location=remote`)
                let RoleResult= await F.json();
                console.log(RoleResult[0].type)  
                console.log(Object.keys(RoleResult).length)
              } catch (error) {
                console.log(error)
              } 
            }
            Found2();
          }).then(response3 => {
              const Found3 = async function (response){
                try {
                  let F =  await  fetch(`https://jobs.github.com/positions.json?description=${array4[i]}&location=remote`)
                  let RoleResult= await F.json();
                  console.log(RoleResult[0].type)  
                  console.log(Object.keys(RoleResult).length)
                } catch (error) {
                  console.log(error)
                } 
              }
              Found3();
            }).then(response4 => {
                const Found4 = async function (response){
                  try {
                    let F =  await  fetch(`https://jobs.github.com/positions.json?description=${array5[i]}&location=remote`)
                    let RoleResult= await F.json();
                    console.log(RoleResult[0].type)  
                    console.log(Object.keys(RoleResult).length)
                    return RoleResult;

                  } catch (error) {
                    console.log(error)
                  } 
                }
                Found4();
                console.log(Found4)
              }).then(response5 => {
                  console.log('hi')
                  console.log(Found4)  
                })
                .catch(error => {
                return res.json(error)
              })
              .catch(error => {
                return res.json(error)
            }) 
            .catch(error => {
              return res.status(400).json(error)
          }) 
        .catch(error => {
          return res.status(400).json(error)
        }) 
      .catch(error => {
        return res.status(400).json(error)
      }) 
    }
    catch (error) {
      return res.status(500).json(error)
    }
  },

    async fetchPreferredJobs1(req, res) {
    try {
    const { _id } = req.params; 
    let registeredUser = await registeredUsers.findOne({ _id: _id });
    let pr = registeredUser.prefered_job_role;
    let ple = registeredUser.prefered_job_level;
    let pt = registeredUser.prefered_job_type;
    let plo = registeredUser.prefered_job_location;
    let ps = registeredUser.prefered_job_stack;
    let array = pr.split(',');
    let array2 = ple.split(',');
    let array3 = pt.split(',');
    let array4 = plo.split(',');
    let array5 = ps.split(',');
    console.log(array);
    console.log(array2);
    console.log(array3);
    console.log(array4);
    console.log(array5);
    for(let i=0;i<array.length; i++)
    for(let i=0;i<array2.length; i++)
    for(let i=0;i<array3.length; i++)
    for(let i=0;i<array4.length; i++)
    for(let i=0;i<array5.length; i++)
    await  fetch(`https://jobs.github.com/positions.json?description=${array[i]}&location=remote`)
    .then(response => {
  async function Okay () {
          let A =  await  fetch(`https://jobs.github.com/positions.json?description=${array[i]}&location=remote`);
          let RoleResult= await A.json();
          console.log(RoleResult[0].type)  
          console.log(Object.keys(RoleResult).length)  
      
              let B =  await  fetch(`https://jobs.github.com/positions.json?description=${array2[i]}&location=remote`)
              let RoleResult1= await B.json();
              console.log(RoleResult1[0].type)  
            console.log(Object.keys(RoleResult1).length)

                let C =  await  fetch(`https://jobs.github.com/positions.json?description=${array3[i]}&location=remote`)
                let RoleResult2= await C.json();
                console.log(RoleResult2[0].type)  
                console.log(Object.keys(RoleResult2).length)

                  let D =  await  fetch(`https://jobs.github.com/positions.json?description=${array4[i]}&location=remote`)
                  let RoleResult3= await D.json();
                  console.log(RoleResult3[0].type)  
                  console.log(Object.keys(RoleResult3).length)

                    let E =  await  fetch(`https://jobs.github.com/positions.json?description=${array5[i]}&location=remote`)
                    let RoleResult4= await E.json();
                    console.log(RoleResult4[0].type)  
                    console.log(Object.keys(RoleResult4).length)
                    // console.log(RoleResult4)  
                    
                   return  RoleResult4;
                  
  }
  let K =  Okay();
  async function Okay1() {
    let H = await K;
    console.log(H);
    return  RoleResult4;
  }
      })
      .then(reply =>{

        return res.status(200).json({
          message: "success"
        })
      })

    }
    catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  },


  async me(req, res) {
    try {
      let data = await fetch("https://jobs.github.com/positions.json?location=remote");
      let main = await data.json();
      return res.status(200).json({
        count: Object.keys(main).length,
        main
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  async fetchSingle(req, res) {
    // I'll be making use of this thank you very much. 

    // @Albert, Welcome home!
    let id = req.params.job_id;


    try {
      let data = await fetch("https://jobs.github.com/positions/" + id + ".json");

      let main = await data.json();

      let similar_data_query = "https://jobs.github.com/positions.json?description=" + encodeURIComponent(main.title.slice(0, 10));

      let similar_data = await fetch(similar_data_query);

      let sub_data = await similar_data.json();

      sub_data = sub_data.sort().slice(0, 3)

      let summary = main.description.slice(0, main.description.indexOf("</p>", 450));

      const stripeSession = await session;

      return res.status(200).render('singleJob', {
        content: main,
        summary: summary,
        title: main.title,
        similar_jobs: sub_data,
        sessionId: stripeSession.id
      })
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  async get_api_jobs(req, res) {
    let data = await fetch("https://jobs.github.com/positions.json?location=remote");
    let main = await data.json();

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

      // Next and previous buttons should not always show
      buttons: {
        previous: (page === 1) ? false : page - 1,
        next: (page === pages) ? false : page + 1,
      },

      // we all need helpers. Baba God hear me out
      helpers: {

        // this helps with displaying the page links, I guess
        populate_links: function () {
          links = "";
          for (let i = 0; i < pages; i++) {
            if (page == i + 1)
              links += `<li class="page-item active"><a class="page-link" href="jobs?page=${i+1}">${i+1}</a></li>`
            else
              links += `<li class="page-item"><a class="page-link" href="jobs?page=${i+1}">${i+1}</a></li>`
          }
          return links;
        },
      }
    });
  },
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
      job_pay_min: req.body.minimum_salary,
      job_pay_max: req.body.maximum_salary,
      career_level: req.body.career_level,
      location: req.body.location,
      job_description: req.body.job_description,
      image_link: req.body.image_link
    };
    try {
      let createdJob = await db.create(queryText);
      sendMailForRemoteJob(createdJob);
      return res.status(201).redirect("/managejobs");
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
      _id: req.params.job_id
    };
    try {

      let foundJob = await db.findOne(queryText);
     
      const stripeSession = await session;

      return res.status(200).render("singleFeaturedJob", { 
        content: foundJob,
        sessionId: stripeSession.id
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
};
module.exports = Jobs;