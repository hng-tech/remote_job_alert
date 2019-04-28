const _ = require("lodash");
const db = require("./promise").DbAgent;
const paystack = require("paystack")(process.env.PAYSTACK_SECRET_KEY);

const Paystack = {
  async pay(req, res) {
    try {
      const data = req.body;
      const amount = 50000; //#500 Naira
      const email = data.email;
      const response = await paystack.transaction.initialize({ amount, email });
      if (!response.status) return res.status(400).send(response.message);
      return res.redirect(response.data.authorization_url);
    } catch (err) {
      return res.status(400).send(err);
    }
  }
};

module.exports = Paystack;
