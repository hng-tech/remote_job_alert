const UserController = require('./controllers/user');
const schedule = require('node-schedule');

var j = schedule.scheduleJob(
  { hour: 14, minute: 10, dayOfWeek: 4 },
  UserController.sendMailForRemoteJob
);

module.exports = j;
