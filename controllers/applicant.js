const db = require('./promise').DbApplicant;
const jobDb = require('./promise').Db;
const userModel = require('../models/user');

const validateApplicantQueryText = require('../validation/applicant');

const Applicant = {
  async create_applicant(req, res) {
    const { errors, isValid } = validateApplicantQueryText(req.body);

    // Check Validation
    if (!isValid) {
      req.flash('errors', 'There are errors in your details filled, Retry');
    }

    const queryText = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      number: req.body.number,
      experience: req.body.experience,
      tech_stack: req.body.tech_stack,
      linkedin_profile: req.body.linkedin_profile,
      github_profile: req.body.github_profile,
      website: req.body.website
    };
    try {
      let createdApplicant = await db.create(queryText);
      req.flash('success', 'Your Details have been Submitted Successfully');
      return res.redirect('/');
    } catch (error) {
      req.flash('errors', 'There are errors in your details filled, Retry');
      return res.redirect('/applicant');
      return res.send(error);
    }
  },
  async get_all(req, res) {
    const queryText = {};
    let jobCount = await jobDb.countDocuments(queryText);
    let usersCount = await userModel.countDocuments({});
    try {
      let foundApplicant = await db.find(queryText);
      return res.status(200).render('applicant_data', {
        content: foundApplicant,
        usersCount,
        jobCount,
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

  async cancel(req, res) {
    const queryText = {
      _id: req.params.applicant_id
    };
    try {
      let foundApplicant = await db.findOneAndDelete(queryText);
      console.log(foundApplicant);
      return res.status(200).redirect('/manageapplicants');
    } catch (error) {
      return res.status(400).send(error);
    }
  }
};

module.exports = Applicant;
