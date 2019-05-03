const UserController = require('./controllers/user');
const schedule = require('node-schedule');

var j = schedule.scheduleJob('30 7 * * *', UserController.sendMail);

module.exports = j;
