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
const Subscription = require("../controllers/admin");
const session = require("../controllers/stripe");
var passport = require("passport");

/* GET home page. */
//router.get("/", Home.index);
router.get("/", async function(req, res, next) {
  try {
    const stripeSession = await session;
    const jobs = await JobModel.find();
    res.render("index", {
      title: "DevAlert | Home",
      contents: jobs,
      sessionId: stripeSession.id,
      user: (typeof req.session.user == 'undefined') ? null : req.session.user,
      helpers: {
        inc: function(index) {
          index++;
          return index;
        },
        limit: function(arr, limit) {
          if (!Array.isArray(arr)) {
            return [];
          }
          return arr.slice(0, limit);
        }
      }
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// GET About us page
router.get("/about", Home.aboutUs);

// Admin auth Page
router.get("/admin", Home.admin);

router.post("/admin", function(req, res, next) {
  if (req.body.username && req.body.password) {
    Admin.authenticate(req.body.username, req.body.password, function(
      error,
      admin
    ) {
      if (error || !admin) {
        // var err = new Error('Wrong username or password.');
        // err.status = 401;
        // return next(err);
        return res.status(401).json({
          message: "Wrong username or password"
        });
        req.session.err;
        return res.redirect("/admin");
        // res.render('login', { error: req.session.error });
        // delete res.session.error;
      } else {
        req.session.adminId = admin._id;
        return res.redirect("/dashboard");
      }
    });
  }
});

//Authenticate Admin Login to Dashboard
router.get("/dashboard", function(req, res, next) {
  Admin.findById(req.session.adminId).exec(function(error, admin) {
    if (error) {
      return next(error);
    } else {
      if (admin === null) {
        var err = new Error("Not authorized! Go back!");
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
router.get("/logout", function(req, res) {
  req.session.destroy();
  req.logout();
  res.status(401).redirect("/");
});

//successful payment
router.get("/successful-payment", function(req, res) {
  res.render("payment_success", { user: (typeof req.session.user == 'undefined') ? null : req.session.user });
});

router.get("/payment-failed", function(req, res) {
  res.render("payment_failed", { user: (typeof req.session.user == 'undefined') ? null : req.session.user });
});

// Manage jobs page
// Only authorised persons can access this page
router.get("/managejobs", function(req, res, next) {
  Admin.findById(req.session.adminId).exec(function(error, admin) {
    if (error) {
      return next(error);
    } else {
      if (admin === null) {
        var err = new Error("Not authorized! Go back!");
        err.status = 400;
        res.redirect("/admin");
        //  return next(err);
      } else {
        return next();
      }
    }
  });
});

// Manage Appliants page
// Only authorised persons can access this page
router.get("/manageapplicants", function(req, res, next) {
  Admin.findById(req.session.adminId).exec(function(error, admin) {
    if (error) {
      return next(error);
    } else {
      if (admin === null) {
        var err = new Error("Not authorized! Go back!");
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

// GET FAQS us page
router.get("/faqs", Home.faqs);

// GET Policy page
router.get("/privacy", Home.privacy);

// GET Terms and conditions page
router.get("/terms", Home.terms);

// GET JOBS DETAILS PAGE
router.get("/job_details", Home.job_details);

//Job Routes
//open DB Jobs endpoint
router.get("/jobs_json", Jobs.get_all_json);
router.get("/jobs_json/:job_id", Jobs.get_one_json);
router.get("/jobs_api", Jobs.fetchData);
router.get("/jobs_api/:slug", Jobs.fetchSingle);

router.get("/jobs/category", Home.category);

// Fetching jobs by category
router.get('/all-jobs', Jobs.fetchAllSearchJobs);
router.get('/custom_search/:_id', Jobs.fetchAllCustomSearchJobs);

// Fetch Jobs by Tech

/* There is an Error in this route, it is crashing the server */
//router.post('/jobs', Jobs.validate('create'), Jobs.create);
router.post("/dashboard", Jobs.create);
router.get("/jobs", Jobs.get_api_jobs);

/////////////////////////////////////////////////
router.get("/jobs/featured/:slug", Jobs.get_one);
router.get("/jobs/:slug", Jobs.fetchSingle);
//router.get("/jobs/:job_id/edit", Jobs.edit);
router.post("/jobs/:job_id", Jobs.update_job);
router.get("/jobs/:job_id/delete", Jobs.cancel_job);

router.get("/jobs/full-time/:tech", Jobs.fetchAllFullTimeSearchJobs);
router.get("/jobs/part-time/:tech", Jobs.fetchAllPartTimeSearchJobs);
router.get("/jobs/contract/:tech", Jobs.fetchAllContractSearchJobs);

// for registered users
router.post("/register_user", Jobs.create_registered_user);
router.post("/update_user/:_id", Jobs.update_registered_user);
router.get("/view_all_users", Jobs.view_all_registered_users);
router.get("/job-preference/:_id", Jobs.fetchPreferredJobs);

//Agent Routes
router.get("/agents", Agents.get_all_agents);
router.post("/agents", Agents.create_agent);
router.post("/pay", Paystack.pay);
router.get("/invoice", Home.get_summary);
//Dashboard Links
router.get("/dashboard", Jobs.get_all);
router.get("/manageapplicants", Applicant.get_all);
router.get("/admin/managejobs", Home.managejobs);
router.get(
  "/admin/manage_payments",
  function(req, res, next) {
    Admin.findById(req.session.adminId).exec(function(error, admin) {
      if (error) {
        return next(error);
      } else {
        if (admin === null) {
          var err = new Error("Not authorized! Go back!");
          err.status = 400;
          res.redirect("/admin");
          //  return next(err);
        } else {
          return next();
        }
      }
    });
  },
  Home.manage_payments
);
router.get(
  "/admin/manageagents",
  function(req, res, next) {
    Admin.findById(req.session.adminId).exec(function(error, admin) {
      if (error) {
        return next(error);
      } else {
        if (admin === null) {
          var err = new Error("Not authorized! Go back!");
          err.status = 400;
          res.redirect("/admin");
          //  return next(err);
        } else {
          console.log("hi1");
          return next();
        }
      }
    });
  },
  Home.manageagents
);
router.get(
  "/admin/managesubscribers",
  function(req, res, next) {
    Admin.findById(req.session.adminId).exec(function(error, admin) {
      if (error) {
        return next(error);
      } else {
        if (admin === null) {
          var err = new Error("Not authorized! Go back!");
          err.status = 400;
          res.redirect("/admin");
          //  return next(err);
        } else {
          return next();
        }
      }
    });
  },
  Home.managesubscribers
);

router.get(
  "/admin/managefeaturedjobs",
  function(req, res, next) {
    Admin.findById(req.session.adminId).exec(function(error, admin) {
      if (error) {
        return next(error);
      } else {
        if (admin === null) {
          var err = new Error("Not authorized! Go back!");
          err.status = 400;
          res.redirect("/admin");
          //  return next(err);
        } else {
          return next();
        }
      }
    });
  },
);

router.get("/admin/managefeaturedjobs", Jobs.get_all_featured);

//Deleting Applicant details
router.get("/applicant/:applicant_id/delete", Applicant.cancel);

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

router.get("/admin/send-mail", async (req, res) => {
  UserController.sendMailForRemoteJob()
    .then(() => {
      res.status(200).json({});
    })
    .catch(err => res.status(500).json(err));
});
router.get("/unsubscribe", Home.unsubscribe);

router.get("/unsubscribe_success", Home.unsubscribe_success);

//unsuscribe user from mailing
router.get("/unsubscribe/:email", UserController.unsubscribeUser);

//contact
router.post("/contact", UserController.sendContactAlert);

/*FACEBOOK AUTH*/

// GET User Login page
router.get("/login", function(req, res) {
  res.render("user-login");
});

// router.get("/auth", function (req, res, next){
//   res.status(200).render('auth')
// });
router.get("/job-preference", isLoggedIn, Jobs.setPreferences)

router.post("/job-preference/update", isLoggedIn, Jobs.updatePreferences)
  

// Choose Agent Page
router.get("/choose_agent", isLoggedIn, function(req, res) {
  res.render("choose_agent.hbs", {
    user: (typeof req.session.user == 'undefined') ? null : req.session.user
  });
});

// route for facebook authentication and login
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"]
  })
);

router.get(
  "/auth/facebook/callback", passport.authenticate("facebook", {failureRedirect: "/login"}), Jobs.setPreferences);

// route middleware to make sure a user is logged in.... Please don't touch
function isLoggedIn(req, res, next) {
  // console.log("req is ", Object.keys(req));
  // console.log("sessionID is ", req.sessionID);
  // console.log("session is", req.session);
  // console.log("session store is", req.sessionStore);
  //console.log('check login status');
  //if user is authenticated in the session, carry on
  // if (req.isAuthenticated() || req.session.user !== undefined) return next();
  if (req.session.user !== undefined) return next();
  // if they aren't redirect them to the auth page
  res.redirect("/login");
}
// GOOGLE ROUTES =======================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//the callback after google has authenticated the user
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/job-preference",
    failureRedirect: "/login"
  })
);

router.get("/view_all_email_subscribers", Subscription.viewAllEmailSubscribers);
router.get(
  "/view_one_email_subscriber/:_id",
  Subscription.viewOneEmailSubscriber
);
router.get(
  "/delete_one_email_subscriber/:_id",
  Subscription.DeleteOneEmailSubscriber
);
router.get(
  "/delete_all_email_subscribers",
  Subscription.DeleteAllEmailSubscribers
); //CAUTION, IT'S WORKING
router.post("/create_agent", Subscription.create_agent);
router.post("/rate_an_agent/:_id", Subscription.rateAnAgent);
router.get("/view_all_agents", Subscription.get_all_agents);
router.get("/view_one_agent/:_id", Subscription.get_one_agent);
router.get("/delete_one_agent/:_id", Subscription.DeleteOneAgent);
router.get("/delete_all_agents", Subscription.DeleteAllAgents); //CAUTION, IT'S WORKING
router.get("/invoice", Subscription.savePayment);
router.get("/receipt/:id", Subscription.redirect);
router.get("/view_all_payments", Subscription.view_all_payments);
router.get("/view_one_payment/:_id", Subscription.view_one_payment);
router.get("/delete_one_payment/:_id", Subscription.deleteOnePayment);
router.get("/delete_all_payments", Subscription.deleteAllPayments); //CAUTION, IT'S WORKING
module.exports = router;
