var express = require('express');
var router = express.Router();
var passportFacebook = require('../auth/facebook');
var passportGoogle = require('../auth/google');


// GET Social Auth Page .....LOGIN ROUTER
// router.get("/login", function (req, res, next){ 
//     res.render('login', {title: 'Please Sign In with:' }); 
//   });
  /* LOGOUT ROUTER */
  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

//   /* FACEBOOK ROUTER */
//   router.get('/auth/facebook',
//     passportFacebook.authenticate('facebook'));
  
//   router.get('/auth/facebook/callback',
//     passportFacebook.authenticate('facebook', {
//        successRedirect: '/',
//       failureRedirect: '/login' }),
//     function(req, res) {
//       res.redirect('/');
//     }); 
  
//   /* GOOGLE ROUTER */
//   router.get('/google', 
//   passportGoogle.authenticate('google', {
//     scope: 'https://www.google.com/m8/feeds' }));
  
//   router.get('/google/callback',
//    passportGoogle.authenticate('google', {
//      successRedirect: '/contact',
//      failureRedirect: '/login'}),
//     function(req, res) {
//        res.redirect('/contact');
//   });
  
module.exports = router;