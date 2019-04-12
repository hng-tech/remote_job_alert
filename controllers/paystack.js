const _ = require("lodash");
const db = require("./promise").DbAgent;
const secretKey = "sk_test_a66878c14f256d4f84f31591e07280d6d18b78b4";
const paystack = require("paystack")(secretKey);

const Paystack = {
  async pay(req, res) {
    try {
      const data = req.body;
      const amount = 500000; //#5000 Naira
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
