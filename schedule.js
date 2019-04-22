const UserController = require('./controllers/user');
const schedule = require('node-schedule');

var j = schedule.scheduleJob(
  { hour: 18, minute: 30, dayOfWeek: 5 },
  UserController.sendMailForRemoteJob
);

module.exports = j;
