var fbSession = require('passport-facebook');
var googleSess = require('passport-google-oauth');
var express = require("express");
var router = express.Router();
var Jobs = require("../controllers/controllers");
var passport = require("passport");

var auth_controllers = require('../controllers/auth')

// endpoints for auth with github.
router.get('/github', auth_controllers.authenticate);

// endpoints for callback.
router.get('/github/callback', auth_controllers.callback);

// route for facebook authentication and login
router.get("/facebook", passport.authenticate("facebook", {scope: ["public_profile", "email"]}));

router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), Jobs.setPreferences);


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

//the callback after google has authenticated the user
router.get("/google/callback", passport.authenticate("google", {successRedirect: "/job-preference",failureRedirect: "/login"}));


module.exports = router;
