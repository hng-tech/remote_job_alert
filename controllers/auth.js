// Web application which authenticates to github
var http = require('http')
    , url = require('url')
    , qs = require('querystring')
    , github = require('octonode')
    , session = require('express-session');

let User = require('../models/login');

// Build the authorization config and url
var auth_url = github.auth.config({
    id: process.env.GITHUB_CLIENTID,
    secret: process.env.GITHUB_SECRET,
}).login(['user']);

// Store info to verify against CSRF
var state = auth_url.match(/&state=([0-9a-z]{32})/i);

// Handle github authentication
exports.authenticate = function (req, res) {
    res.writeHead(302, { 'Content-Type': 'text/plain', 'Location': auth_url })
    res.end('Redirecting to ' + auth_url);
};

// Handle callback
exports.callback = function (req, res) {
    var sessData = req.session;
    uri = url.parse(req.url);
    var values = qs.parse(uri.query);
    // Check against CSRF attacks
    if (!state || state[1] != values.state) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('');
    } else {
        github.auth.login(values.code, function (err, token, headers) {

            var client = github.client(token);

            sessData.token = token;

            client.get('/user', {}, function (err, status, body, headers) {

                // find the user in the database based on their github account id
                User.findOne
                ({ 
                    'account._id': `${body.id}`
                }, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        res.redirect("/login");

                    // if the user is found, then log them in
                    if (user) {
                        req.session.user = user.account;
                        res.redirect("/jobs"); // user found, return that user
                    } else {
                        // if there is no user found with that github id, create them
                        let newUser = new User();

                        // set all of the github information in our user model
                        newUser.account._id = `${body.id}`; 
                        newUser.account.token = token; 
                        newUser.account.name = (body.name == null)? body.login : body.name; 
                        newUser.account.email = body.email;
                        newUser.account.type = "github";

                        // save our user to the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            else
                                req.session.user = newUser.account;
                                res.redirect('/job-preference');
                        });
                    }

                });
                
            });
        });
    }
};