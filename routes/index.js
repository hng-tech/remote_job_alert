var Home = require("../controllers/home");
var express = require("express");
var Jobs = require("../controllers/controllers");
var Agents = require("../controllers/agent");
var router = express.Router();
const UserController = require("../controllers/user");
const Validation = require("../validation/email");
const Paystack = require("../controllers/paystack");
var Admin = require("../models/admin");
var JobModel = require("../models/jobs");
const Applicant = require("../controllers/applicant");
/* GET home page. */
//router.get("/", Home.index);
router.get("/", function(req, res, next) {
  JobModel.find(function(err, jobs) {
    res.render("index", { title: "Remote Job Alert", contents: jobs });
  });
});

// GET About us page
router.get("/about", Home.aboutUs);

//Admin Page
router.get('/admin', Home.admin);

router.post('/admin', function(req, res, next){
	if (req.body.username && req.body.password) {
    Admin.authenticate(req.body.username, req.body.password, function (error, admin) {
      if (error || !admin) {
        var err = new Error('Wrong username or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.adminId = admin._id;
        return res.redirect('/managejobs');
      }
    });
}
});

//Authenticate Admin Login to Manage Jobs
router.get('/managejobs', function (req, res, next) {
  Admin.findById(req.session.adminId)
    .exec(function (error, admin) {
      if (error) {
        return next(error);
      } else {
        if (admin === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          res.redirect("/admin");
        //  return next(err);
        } else {
          return next();
        }
      }
    });
});

//Authenticate Admin Login to Manage Appliants
router.get('/manageapplicants', function (req, res, next) {
  Admin.findById(req.session.adminId)
    .exec(function (error, admin) {
      if (error) {
        return next(error);
      } else {
        if (admin === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          res.redirect("/admin");
        //  return next(err);
        } else {
          return next();
        }
      }
    });
});

// GET Contact us page
router.get("/contact", Home.contactUs);


//Routes for user pages
// GET User Login page
router.get("/user-login", Home.userLogin);

// GET User Signup page
router.get("/user-signup", Home.userSignup);



// GET FAQS us page
router.get("/faqs", Home.faqs);

// GET JOBS DETAILS PAGE
router.get("/job_details", Home.job_details);

//Job Routes
router.get("/jobs_json", Jobs.get_all_json);
router.get("/jobs_json/:job_id", Jobs.get_one_json);
router.get("/jobs_api", Jobs.fetchData);

/* There is an Error in this route, it is crashing the server */
//router.post('/jobs', Jobs.validate('create'), Jobs.create);
router.post("/jobs", Jobs.create);

/////////////////////////////////////////////////
router.get("/jobs/:job_id", Jobs.get_one);
//router.get("/jobs/:job_id/edit", Jobs.edit);
router.post("/jobs/:job_id", Jobs.update_job);
router.get("/jobs/:job_id/delete", Jobs.cancel_job);

//Agent Routes
router.get("/agents", Agents.get_all_agents);
router.post("/agents", Agents.create_agent);
router.post("/pay", Paystack.pay);
router.get("/invoice", Home.get_summary);
//Dashboard Links
router.get("/managejobs", Jobs.get_all);
router.get("/manageapplicants", Applicant.get_all);

//Route for Applicant details
router.get("/applicant", Home.get_applicant);
router.post("/applicant", Applicant.create_applicant);

//check if email is valid, then sends welcome email and saves email to db
router.post(
  "/email-subscription",
  Validation.validateEmail(),
  Validation.returnErrors,
  UserController.sendMail
);

//unsuscribe user from mailing
router.get("/unsubscribe/:email", UserController.unsubscribeUser);

//contact
router.post("/contact", UserController.sendContactAlert);

/* THERE IS A PROBLEM WITH THE BELOW ROUTES, THEY ARE BREAKING THE SITE*/

// GET Job list page
// router.get('/jobs', Jobs.index);

// // POST Job alerts subscription
// router.post('/subscribe', Jobs.jobAlertSubscription);

// router.get('/remote-jobs', Jobs.get_all)
// router.post('/remote-jobs', Jobs.create);
// router.get('/remote-jobs/:job_id', Jobs.get_one);
// router.get('/remote-jobs/:job_id', Jobs.edit);
// router.get('/remote-jobs/:job_id', Jobs.update_job);
// router.get('/remote-jobs/:job_id', Jobs.cancel_job);

module.exports = router;
