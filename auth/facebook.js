var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');

passport.use(new FacebookStrategy({
    clientID: "335375807167683",
    clientSecret: "d9b26e6a65dea77aec2651f4d73fdbdc",
    callbackURL: "http://localhost:3020/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done){
    User.findOrCreate({name: profile.displayName}, {name: profile.displayName,userid: profile.id},
        function(err, user){
            if (err){return done(err);}
            done(null, user);
        });
}
));

module.exports = passport;