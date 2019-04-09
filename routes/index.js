var Home = require('../controllers/home');

var express = require('express');
var Jobs = require("../controllers/controllers");
var router = express.Router();

/* GET home page. */
router.get('/', Home.index);

// GET About us page
router.get('/about', Home.aboutUs);

// GET Contact us page
router.get('/contact', Home.contactUs);

// GET JOBS DETAILS PAGE
router.get('/job_details', Home.job_details);

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
