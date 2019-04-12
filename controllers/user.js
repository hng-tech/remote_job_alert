const nodemailer = require("nodemailer");
const User = require("../models/user");
const mailgun = require("mailgun-js");
const path = require("path");
const fs = require("fs");

async function sendMail(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      console.log(user);
      req.flash("emailError", "Email already subscribed");
      return res.redirect("/");
    }
    //if email doesn't exist
    await User.create(req.body);

    const mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    });
    const filename = path.normalize(
      path.join(__dirname, "../email-templates/welcome.hbs")
    );
    const html = fs.readFileSync(filename).toString();
    const data = {
      from: "Devalert <noreply@devalert.com>",
      to: email,
      subject: "Devalert Subscription",
      html
    };
    const body = await mg.messages().send(data);

    req.flash("success", "Email subscription was successful");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = {
  sendMail
};
