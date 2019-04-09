var mongoose = require('mongoose');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// The database setup
// we should probable store the url in .env for security reasons.
var databaseUrl = "mongodb://job_alert_admin:#developerHNG1@ds135456.mlab.com:35456/job_alert_db";

// connect to database
mongoose.connect(databaseUrl, { useNewUrlParser: true },
  function(err, client) {
    if (err) console.log(err);
    console.log('Connection passed');
  });

let db = mongoose.connection;

db.once("open", () => console.log("Connected to database"));

// checks if connection to db is a success
db.on("error", console.error.bind(console, "Database connection error:"));


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

console.log("Server running on PORT 3000");

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
