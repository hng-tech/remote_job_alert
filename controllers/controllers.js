const db = require("./promise").Db;
const validateQueryText = require("../validation/controller");
const fetch = require("node-fetch");
const { sendMailForRemoteJob } = require("./user");
const userModel = require("../models/user");

const Jobs = {
  async fetchData(req, res) {
    let data = await fetch("https://remoteok.io/api?ref=producthunt");
    let main = await data.json();
    return res.status(200).json(main);
  },
  async create(req, res, next) {
    // // Check Validation
    // if (!isValid) {
    // 	return res.status(400).json(errors);
    // }

    const queryText = {
      company_name: req.body.company_name,
      job_title: req.body.job_title,
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
      sendMailForRemoteJob(createdJob, next);
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
      return res.status(200).render("manage_jobs", {
        content: foundJobs,
        jobCount: foundJobs.length,
        usersCount,
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
