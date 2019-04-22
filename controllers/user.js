const nodemailer = require('nodemailer');
const User = require('../models/user');
const Job = require('../models/jobs');
const mailgun = require('mailgun-js');
const path = require('path');
const hbs = require('handlebars');
const fs = require('fs');

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
  host: 'api.eu.mailgun.net',
  endpoint: '/v3'
});

async function unsubscribeUser(req, res, next) {
  try {
    await User.deleteOne({ email: req.params.email });
    req.flash(
      'success',
      'You successfully unsubscribed from DevAlert NewsLetter'
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function sendMail(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      console.log(user);
      req.flash('emailError', 'Email already subscribed');
      return res.redirect('/');
    }
    //if email doesn't exist
    await User.create(req.body);

    const filename = path.normalize(
      path.join(__dirname, '../email-templates/welcome.hbs')
    );
    const html = fs
      .readFileSync(filename)
      .toString()
      .replace(/{{email}}/, email);
    const data = {
      from: 'Devalert <noreply@devalert.com>',
      to: email,
      subject: 'Devalert Subscription',
      html
    };
    const body = await mg.messages().send(data);

    req.flash('success', 'Email subscription was successful');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function sendMailForRemoteJob() {
  try {
    const last7days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const jobs = await Job.find({ createdAt: { $gte: last7days } });
    if (jobs.length === 0) {
      return;
    }
    const file = fs
      .readFileSync(path.join(__dirname, '../email-templates/remote_job.hbs'))
      .toString();
    const template = hbs.compile(file);

    User.find()
      .cursor()
      .on('data', async function(user) {
        const html = template({ jobs, email: user.email });
        const data = {
          from: 'Devalert <noreply@devalert.com>',
          to: user.email,
          subject: 'New Remote job Alert! ',
          html: html.replace(/{{email}}/, user.email)
        };
        mg.messages().send(data, (error, body) => {
          if (error) console.error(error);
        });
      })
      .on('end', function() {
        console.log('Done!');
      });
  } catch (err) {
    console.error(err);
  }
}

async function sendContactAlert(req, res, next) {
  try {
    const { email, name, subject, message } = req.body;
    const filename = path.normalize(
      path.join(__dirname, '../email-templates/contact.hbs')
    );
    const html = fs
      .readFileSync(filename)
      .toString()
      .replace(/{{name}}/, name);
    const data = {
      from: 'Devalert <supports@devalert.com>',
      to: email,
      subject: 'Contact Us - DevAlert',
      html
    };
    mg.messages().send(data, (error, body) => {
      if (error) console.error(error);
      console.log(body);
    });

    req.flash(
      'success',
      'Your message was sent. Our support would reply within 24 hours.'
    );
    res.redirect('/contact');
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function test() {
  console.log('works');
}

module.exports = {
  unsubscribeUser,
  sendMail,
  sendMailForRemoteJob,
  sendContactAlert,
  test
};
