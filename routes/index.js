var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Remote Job Alert' });
});

// Get main page
router.get('/home', (req, res, next) => {
	res.render('home');
})

module.exports = router;
