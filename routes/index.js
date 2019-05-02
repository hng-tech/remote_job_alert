var Home = require('../controllers/home');
var express = require('express');
var Jobs = require('../controllers/controllers');
var Agents = require('../controllers/agent');
var router = express.Router();
const UserController = require('../controllers/user');
const Validation = require('../validation/email');
const Paystack = require('../controllers/paystack');
var Admin = require('../models/admin');
var JobModel = require('../models/jobs');
const Applicant = require('../controllers/applicant');
const session = require('../controllers/stripe');
//var app = require('passport');
/* GET home page. */
//router.get("/", Home.index);
router.get('/', async function(req, res, next) {
  try {
    const stripeSession = await session;
    const jobs = await JobModel.find();
    res.render('index', {
      title: 'Remote Job Alert',
      contents: jobs,
      sessionId: stripeSession.id
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// GET About us page
router.get('/about', Home.aboutUs);

// Admin auth Page
router.get('/admin', Home.admin);

router.post('/admin', function(req, res, next) {
  if (req.body.username && req.body.password) {
    Admin.authenticate(req.body.username, req.body.password, function(
      error,
      admin
    ) {
      if (error || !admin) {
        var err = new Error('Wrong username or password.');
        err.status = 401;
        // return next(err);
        req.session.err;
        return res.redirect('/admin');
        // res.render('login', { error: req.session.error });
        // delete res.session.error;
      } else {
        req.session.adminId = admin._id;
        return res.redirect('/dashboard');
      }
    });
  }
});

//Authenticate Admin Login to Dashboard
router.get('/dashboard', function (req, res, next) {
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

// Logout
// This is generic and could be used anywhere
router.get('/logout', function(req, res) {
  req.session.destroy();
  //req.logout();
  res.redirect('/admin');
});

// Manage jobs page
// Only authorised persons can access this page
router.get('/managejobs', function(req, res, next) {
  Admin.findById(req.session.adminId).exec(function(error, admin) {
    if (error) {
      return next(error);
    } else {
      if (admin === null) {
        var err = new Error('Not authorized! Go back!');
        err.status = 400;
        res.redirect('/admin');
        //  return next(err);
      } else {
        return next();
      }
    }
  });
});

// Manage Appliants page
// Only authorised persons can access this page
router.get('/manageapplicants', function(req, res, next) {
  Admin.findById(req.session.adminId).exec(function(error, admin) {
    if (error) {
      return next(error);
    } else {
      if (admin === null) {
        var err = new Error('Not authorized! Go back!');
        err.status = 400;
        res.redirect('/admin');
        //  return next(err);
      } else {
        return next();
      }
    }
  });
});

// GET Contact us page
router.get('/contact', Home.contactUs);

//Routes for user pages
// GET User Login page
//router.get("/user-login", Home.userLogin);

// GET User Signup page
//router.get("/user-signup", Home.userSignup);

// GET FAQS us page
router.get('/faqs', Home.faqs);

// GET JOBS DETAILS PAGE
router.get('/job_details', Home.job_details);

//Job Routes
router.get('/jobs_json', Jobs.get_all_json);
router.get('/jobs_json/:job_id', Jobs.get_one_json);
router.get('/jobs_api', Jobs.fetchData);
router.get('/jobs_api/:job_id', Jobs.fetchSingle);

/* There is an Error in this route, it is crashing the server */
//router.post('/jobs', Jobs.validate('create'), Jobs.create);
router.post('/jobs', Jobs.create);

/////////////////////////////////////////////////
router.get('/jobs/:job_id', Jobs.get_one);
//router.get("/jobs/:job_id/edit", Jobs.edit);
router.post('/jobs/:job_id', Jobs.update_job);
router.get('/jobs/:job_id/delete', Jobs.cancel_job);

//Agent Routes
router.get('/agents', Agents.get_all_agents);
router.post('/agents', Agents.create_agent);
router.post('/pay', Paystack.pay);
router.get('/invoice', Home.get_summary);
//Dashboard Links
router.get("/dashboard", Jobs.get_all);
router.get("/manageapplicants", Applicant.get_all);
router.get("/managejobs", Home.managejobs);
router.get("/manageagents", Home.manageagents);
router.get("/managesubscribers", Home.managesubscribers);

//Deleting Applicant details
router.get('/applicant/:applicant_id/delete', Applicant.cancel);

//Route for Applicant details
router.get('/applicant', Home.get_applicant);
router.post('/applicant', Applicant.create_applicant);

//check if email is valid, then sends welcome email and saves email to db
router.post(
  '/email-subscription',
  Validation.validateEmail(),
  Validation.returnErrors,
  UserController.sendMail
);

router.get('/unsubscribe', Home.unsubscribe);

router.get('/unsubscribe_success', Home.unsubscribe_success);

//unsuscribe user from mailing
router.get('/unsubscribe/:email', UserController.unsubscribeUser);

//contact
router.post('/contact', UserController.sendContactAlert);

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


router.get('/view_all_email_subscribers', Subscription.viewAllEmailSubscribers);
router.get('/view_one_email_subscriber/:_id', Subscription.viewOneEmailSubscriber);
router.get('/delete_one_email_subscriber/:_id', Subscription.DeleteOneEmailSubscriber);
// router.get('/delete_all_email_subscribers', Subscription.DeleteAllEmailSubscribers); //CAUTION, IT'S WORKING
router.post('/create_agent', Subscription.create_agent);
router.post('/rate_an_agent/:_id', Subscription.rateAnAgent);
router.get('/view_all_agents', Subscription.get_all_agents);
router.get('/view_one_agent/:_id', Subscription.get_one_agent);
router.get('/delete_one_agent/:_id', Subscription.DeleteOneAgent);
// router.get('/delete_all_agents', Subscription.DeleteAllAgents);  //CAUTION, IT'S WORKING
router.get('/invoice', Subscription.savePayment);
router.get('/receipt/:id', Subscription.redirect);
router.get('/view_all_payments', Subscription.view_all_payments);
router.get('/view_one_payment/:_id', Subscription.view_one_payment);
router.get('/delete_one_payment/:_id', Subscription.deleteOnePayment);
// router.get('/delete_all_payments', Subscription.deleteAllPayments); //CAUTION, IT'S WORKING
module.exports = router;
