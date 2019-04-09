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

//Gets the Job list page
router.get('/jobs', Jobs.get_all)
//create a new job
router.post('/jobs', Jobs.create);
//get details of one of the jobs
router.get('/jobs/:job_id', Jobs.get_one);
//edit job page
router.get('/jobs/:job_id', Jobs.edit);
//update edited job route
router.get('/jobs/:job_id', Jobs.update_job);
//delete job
router.get('/jobs/:job_id', Jobs.cancel_job);

module.exports = router;
