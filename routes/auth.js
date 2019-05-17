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
router.get(
    "/facebook",
    passport.authenticate("facebook", {
        scope: ["public_profile", "email"]
    })
);

router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), Jobs.setPreferences);


router.get("/google", auth_controllers.authenticateAccount);

//the callback after google has authenticated the user
router.get("/google/callback", auth_controllers.getGoogleAccountFromCode);


module.exports = router;