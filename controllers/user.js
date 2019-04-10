const nodemailer = require("nodemailer");
const User = require("../models/user");

async function sendMail(req, res, next) {
  try {
    const user = new User({ email: req.body.email });
    await user.save();
    console.log(user);
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ezechinnaemeka@gmail.com",
        pass: "07036835186"
      }
    });

    const mailOptions = {
      from: "ezechinnaemeka@gmail.com",
      to: user.email,
      subject: "DevAlert Subscription",
      html:
        "<h3>Hello, <h3><p>You subscribed to Devalert. You would be receiving mails on available remote works all around africa.<p> "
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = {
  sendMail
};
