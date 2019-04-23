const _ = require("lodash");
const db = require("./promise").DbAgent;
const secretKey = "sk_live_9f957be2c68dda29dc62a2048a12ef2901f16a57";
const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

const Paystack = {
  async pay(req, res) {
    try {
      const data = req.body;
      const amount = 50000; //#500 Naira
      const email = data.email;
      const response = await paystack.transaction.initialize({ amount, email });
      return res.redirect(response.data.authorization_url);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
};

module.exports = Paystack;
