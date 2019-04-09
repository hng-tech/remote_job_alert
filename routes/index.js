var Home = require('../controllers/home');
var Jobs = require('../controllers/jobs');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', Home.index);

// GET About us page
router.get('/about', Home.aboutUs);

// GET Contact us page
router.get('/contact', Home.contactUs);

// GET Job list page
router.get('/jobs', Jobs.index);

// POST Job alerts subscription
router.post('/subscribe', Jobs.jobAlertSubscription);

module.exports = router;
