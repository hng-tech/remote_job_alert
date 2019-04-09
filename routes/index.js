var express = require('express');
var Jobs = require("../controllers/controllers");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Remote Job Alert' });
});

router.get('/remote-jobs', Jobs.get_all)
router.post('/remote-jobs', Jobs.create);
router.get('/remote-jobs/:job_id', Jobs.get_one);
router.get('/remote-jobs/:job_id', Jobs.edit);
router.get('/remote-jobs/:job_id', Jobs.update_job);
router.get('/remote-jobs/:job_id', Jobs.cancel_job);

module.exports = router;
