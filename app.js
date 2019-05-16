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
const fx = require('money');
var bodyParser = require('body-parser')



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
var authRouter = require('./routes/auth');
// var usersRouter = require('./routes/users');

var app = express(); require('./config/passport')(passport);     //pass passport for configuration

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

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//locals
app.use(function(req, res, next) {
	res.locals.success = req.flash('success');
	res.locals.emailError = req.flash('emailError');
	res.locals.errors = req.flash('errors');
	res.locals.paymentError = req.flash('paymentError');
  res.locals.payment = req.flash('payment');
  res.locals.adminError = req.flash('adminError');
  res.locals.adminSuccess = req.flash('adminSuccess');
  res.locals.user = req.flash('user');
	next();
});


app.use('/', indexRouter);
app.use('/auth', authRouter);
// app.use('/users', usersRouter);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {message:"An internal Server Error Occured. Try again later!"};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
// export default passport;