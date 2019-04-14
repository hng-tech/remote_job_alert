const secretKey = process.env.PAYSTACK_SECRET_KEY;
const paystack = require("paystack")(secretKey);

const Paystack = {
  async pay(req, res) {
    try {
      const data = req.body;
      const amount = 500000; //#5000 Naira
      const email = data.email;
      const response = await paystack.transaction.initialize({ amount, email });
      return res.redirect(response.data.authorization_url);
    } catch (err) {
      return err;
      
    }
  }
};

module.exports = Paystack;
