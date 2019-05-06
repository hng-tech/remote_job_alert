const nodemailer = require('nodemailer');
const User = require('../models/user');
const Job = require('../models/jobs');
const path = require('path');
const hbs = require('handlebars');
const fs = require('fs');
const fetch = require('node-fetch');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 587,
  auth: {
    user: process.env.ZOHO_USER,
    pass: process.env.ZOHO_PASS
  }
});

async function unsubscribeUser(req, res, next) {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email });

    if (user) {
      await User.deleteOne({ email });
      return res.redirect('/unsubscribe_success');
    }
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
      from: 'Devalert Team <info@devalert.me>',
      to: email,
      subject: 'Devalert Remote Job Alert',
      html
    };

    await transporter.sendMail(data);
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
    let data = await fetch(
      'https://jobs.github.com/positions.json?location=remote'
    );
    let jobs = await data.json();
    jobs = jobs.filter(job => new Date(job.created_at) >= last7days);

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
          from: 'Devalert Team <info@devalert.com>',
          to: user.email,
          subject: 'New Remote job Alert! ',
          html: html.replace(/{{email}}/, user.email)
        };
        await transporter.sendMail(data);
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
      from: 'Devalert <supports@devalert.me>',
      to: email,
      subject: 'Contact Us - DevAlert',
      html
    };
    const support = {
      from: 'info@devalert.me',
      to: 'supports@devalert.me',
      subject: subject + ' - ' + email,
      html: `<h3>Sent from ${email} via contact page</h3>
      <p style="font-size:17px; font-weight:bold;">${message}</p>`
    };
    await transporter.sendMail(data);
    await transporter.sendMail(support);

    req.flash(
      'success',
      'Your message has been delivered successfully and would be processed. Thank you.'
    );
    res.redirect('/contact');
  } catch (err) {
    console.error(err);
    next(err);
  }
}

async function sendPreferedMailForRemoteJob(jobs, user) {
  try {
    const file = fs
      .readFileSync(path.join(__dirname, '../email-templates/remote_job.hbs'))
      .toString();
    const template = hbs.compile(file);

    User.find()
      .cursor()
      .on('data', async function(user) {
        const html = template({ jobs, email: user.email });
        const data = {
          from: 'Devalert Team <info@devalert.com>',
          to: user.email,
          subject: 'New Remote job Alert! ',
          html: html.replace(/{{email}}/, user.email)
        };
        await transporter.sendMail(data);
      })
      .on('end', function() {
        console.log('Done!');
      });
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  unsubscribeUser,
  sendMail,
  sendMailForRemoteJob,
  sendContactAlert,
  sendPreferedMailForRemoteJob
};
