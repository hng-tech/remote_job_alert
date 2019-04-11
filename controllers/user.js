const nodemailer = require("nodemailer");
const User = require("../models/user");

async function sendMail(req, res, next) {
  try {
    const user = new User({ email: req.body.email });
    await user.save();
    const transporter = await nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "f4988ca3d96604",
        pass: "3a2c5a6e813d0d"
      }
    });

    const mailOptions = {
      from: "DevAlert Team <noreply@devalert.com>",
      to: user.email,
      subject: "DevAlert Subscription",
      html:
        "<h3>Hello, <h3><p>You subscribed to Devalert. You would be receiving mails on available remote works all around africa.<p> "
    };

    const info = await transporter.sendMail(mailOptions);

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
