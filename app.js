var mongoose = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
require('dotenv').config();
require('./schedule');
const passport = require('passport');
var auth = require('./routes/auth');


// The database setup
// we should probable store the url in .env for security reasons.
var databaseUrl =
  'mongodb://job_alert_admin:#developerHNG1@ds135456.mlab.com:35456/job_alert_db';

// connect to database
mongoose.connect(databaseUrl, { useNewUrlParser: true }, function(err, client) {
  if (err) console.log(err);
  console.log('Connection passed');
});

let db = mongoose.connection;

db.once('open', () => console.log('Connected to database'));

// checks if connection to db is a success
db.on('error', console.error.bind(console, 'Database connection error:'));

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'dfgdhhahg15sdff',
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
      mongooseConnection: db
    })
  })
);

app.use(flash());

//locals
app.use(function(req, res, next) {
  res.locals.success = req.flash('success');
  res.locals.emailError = req.flash('emailError');
  res.locals.errors = req.flash('errors');
  next();
});

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// /*  PASSPORT SETUP  */

app.use(passport.initialize());  //used to initialize passport
app.use(passport.session());     //used to persist sessions
app.use('/auth', auth);

// /*  FACEBOOK AUTH  */


// const FACEBOOK_APP_CLIENT_ID = '872760943056177';
// const FACEBOOK_APP_SECRET = '1dc2c1aa725e38965ba207a43856798c';
// const FACEBOOK_APP_CALLBACK = "http://localhost:3020/auth/facebook/callback";

// const credentials = {
//   facebook: {
//     clientID: process.env.FACEBOOK_APP_CLIENT_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: process.env.FACEBOOK_APP_CALLBACK,
//     profileFields: ['id', 'email', 'name'],
//     passReqToCallback: true
//   },
// };
// const facebookAuth = async (accessToken, refreshToken, profile, done) => {
//   try {
//     console.log(profile);
//     const currentUser = await User.findOrCreate({
//       where: { socialId: profile.id },
//       defaults: {
//         firstName: profile.name.givenName,
//         lastName: profile.name.familyName,
//         username: profile.emails[0].value,
//         email: profile.emails[0].value,
//         socialProvider: profile.provider,
//       },
//     });

//     return done(null, currentUser);
//   } catch (err) {
//     return done(err);
//   }
// };

// passport.use(new FacebookStrategy(credentials.facebook, facebookAuth));



// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_APP_ID,
//     clientSecret: FACEBOOK_APP_SECRET,
//     callbackURL: "http://localhost:3020/auth/facebook/callback"
//   },
//   function(accessToken, refreshToken, user, done) {
//     console.log('accessToken is'+ accessToken );
//     console.log('refreshToken is', refreshToken );
//     console.log('profile is', profile);
//     console.log('user is', user);
//     User.find({ facebookId: profile.id }, function (err, profile){
       
//     if (profile) {
//       user= profile;
//       return done(null,user);
//     }
//     else{
//       return done(null, false);
//     }
//   });
//   }
// ));


module.exports = app;
// export default passport;