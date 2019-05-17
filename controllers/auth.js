// Web application which authenticates to github
var http = require('http')
    , url = require('url')
    , qs = require('query-string')
    , github = require('octonode')
    , { google } = require('googleapis')
    , session = require('express-session');

let User = require('../models/login');

const googleConfig = {
    clientId: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: 'https://devalert.me/auth/google/callback' // this must match your google api settings
};


/*******GOOGLE AUTH******/
var auth = null;

exports.authenticateAccount = function (req, res) {
    auth = new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
    google_auth_url = auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
        scope: [
            'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/userinfo.email',
        ]
    });
    res.writeHead(302, { 'Content-Type': 'text/plain', 'Location': google_auth_url })
    res.end('Redirecting to ' + google_auth_url);
}

/**
 * Extract the email and id of the google account from the "code" parameter.
 */
exports.getGoogleAccountFromCode = async (req, res) => {

    // get the auth "tokens" from the request
    const qscode = qs.parse(qs.extract(req.url)).code;
    const data = await auth.getToken(qscode);
    const token = data.tokens;
    // add the tokens to the google api so we have access to the account
    auth.setCredentials(token);

    // connect to google plus - need this to get the user's email

    const plus = await google.plus({ version: 'v1', auth });;
    const me = await plus.people.get({ userId: 'me' });

    // get the google id and email
    const userGoogleId = me.data.id;
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;

    User.findOne
        ({
            'account._id': `${userGoogleId}`
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
                newUser.account._id = `${userGoogleId}`;
                newUser.account.token = token.access_token;
                newUser.account.name = `${me.data.name.givenName} ${me.data.name.familyName}`;
                newUser.account.email = userGoogleEmail;
                newUser.account.type = "google";

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
};

/*********GOOGLE AUTH END*************/


/*********GITHUB AUTH*************/

// Build the authorization config and url
var github_auth_url = github.auth.config({
    id: process.env.GITHUB_CLIENTID,
    secret: process.env.GITHUB_SECRET,
}).login(['user']);

// Store info to verify against CSRF
var state = github_auth_url.match(/&state=([0-9a-z]{32})/i);

// Handle github authentication
exports.authenticate = function (req, res) {
    res.writeHead(302, { 'Content-Type': 'text/plain', 'Location': github_auth_url })
    res.end('Redirecting to ' + github_auth_url);
};

// Handle callback
exports.callback = function (req, res) {
    var sessData = req.session;
    uri = url.parse(req.url);
    var values = qs.parse(uri.query);
    // Check against CSRF attacks
    if (!state || state[1] != values.state) {

        res.redirect('/login');
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
/*********GITHUB AUTH END*************/