var Home = require('../controllers/home');

var express = require('express');
var Jobs = require("../controllers/controllers");
var Agents = require("../controllers/agent");
var router = express.Router();

/* GET home page. */
router.get('/', Home.index);

// GET About us page
router.get('/about', Home.aboutUs);

// GET Contact us page
router.get('/contact', Home.contactUs);

// GET JOBS DETAILS PAGE
router.get('/job_details', Home.job_details);

//Job Routes
router.get('/jobs', Jobs.get_all);
router.post('/jobs', Jobs.create);
router.get('/jobs/:job_id', Jobs.get_one);
router.get('/jobs/:job_id/edit', Jobs.edit);
router.get('/jobs/:job_id', Jobs.update_job);
router.get('/jobs/:job_id', Jobs.cancel_job);

//Agent Routes
router.get('/agents', Agents.get_all_agents);
router.post('/agents', Agents.create_agent);

module.exports = router;
