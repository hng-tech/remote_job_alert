const db = require("./promise").Db;
const validateQueryText = require("../validation/controller");
const fetch = require("node-fetch");
const { sendMailForRemoteJob } = require("./user");
const userModel = require("../models/user");
const agentModel = require("../models/newAgent");
const Paystack = require('./paystack');
const session = require('./stripe');
const Applicant = require('./applicant');

const Jobs = {
  async fetchData(req, res) {
    let data = await fetch("https://jobs.github.com/positions.json?location=remote");
    let main = await data.json();
    return res.status(200).json(main);
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
      let foundJobs = await db.find(queryText);
      let usersCount = await userModel.countDocuments({});
      let agentsCount = await agentModel.countDocuments({});
      return res.status(200).render("admin_dashboard", {
        content: foundJobs,
        jobCount: foundJobs.length,
        usersCount,
        agentsCount,
        helpers: {
          inc: function(index) {
            index++;
            return index;
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
      return res.status(200).render("/", { content: foundJob });
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

    const { errors, isValid } = validateQueryText(req.body);

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
  }
};

module.exports = Jobs;
