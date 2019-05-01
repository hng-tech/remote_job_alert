var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');

passport.use(new GoogleStrategy({
    clientID: "88528999346-ull7j73vcrgher1dnaoqnk7aov22titk.apps.googleusercontent.com",
    clientSecret: "Veec6L-UwtWQe8Ui8C0UcSxU",
    callbackURL: "http://localhost:3020/auth/google/callback"
},
function(accessToken, refreshToken, profile, done){
    User.findOrCreate({ userid: profile.id}, {name: profile.displayName,userid: profile.id },
        function (err, user){
            return done(err, user);
        });
}
));

module.exports = passport;