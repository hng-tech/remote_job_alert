const UserController = require('./controllers/user');
const schedule = require('node-schedule');

var j = schedule.scheduleJob(
  { hour: 6, minute: 30, dayOfWeek: 1 },
  UserController.sendMailForRemoteJob
);

module.exports = j;
