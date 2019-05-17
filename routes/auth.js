var fbSession = require('passport-facebook');
var googleSess = require('passport-google-oauth');
var express = require("express");
var router = express.Router()

var auth_controllers = require('../controllers/auth')

// endpoints for auth with github.
router.get('/github', auth_controllers.authenticate);

// endpoints for callback.
router.get('/github/callback', auth_controllers.callback);


module.exports = router;