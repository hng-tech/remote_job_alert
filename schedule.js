const UserController = require('./controllers/user');
const schedule = require('node-schedule');

var j = schedule.scheduleJob({hour: 8, minute: 22, dayOfWeek: 0},UserController.sendMailForRemoteJob);

module.exports = j;
