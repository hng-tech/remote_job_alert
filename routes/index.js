var Home = require("../controllers/home");
var express = require("express");
var Jobs = require("../controllers/controllers");
var Agents = require("../controllers/agent");
var router = express.Router();
const UserController = require("../controllers/user");
const Validation = require("../validation/email");

/* GET home page. */
router.get("/", Home.index);

// GET About us page
router.get("/about", Home.aboutUs);

// GET Contact us page
router.get("/contact", Home.contactUs);

// GET JOBS DETAILS PAGE
router.get("/job_details", Home.job_details);

//Job Routes
router.get("/jobs", Jobs.get_all);
/* There is an Error in this route, it is crashing the server */
// router.post('/jobs', Jobs.validate('create'),Jobs.create);

/////////////////////////////////////////////////
router.get("/jobs/:job_id", Jobs.get_one);
router.get("/jobs/:job_id/edit", Jobs.edit);
router.get("/jobs/:job_id", Jobs.update_job);
router.get("/jobs/:job_id", Jobs.cancel_job);

//Agent Routes
router.get("/agents", Agents.get_all_agents);
router.post("/agents", Agents.create_agent);

router.get("/managejobs", (req, res, next) => {
  res.render("manage_jobs", { title: "Manage Jobs" });
});

//check if email is valid, then sends welcome email and saves email to db
router.post(
  "/email-subscription",
  Validation.validateEmail(),
  Validation.returnErrors,
  UserController.sendMail
);

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
