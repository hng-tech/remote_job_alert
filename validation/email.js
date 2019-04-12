const { body, validationResult } = require("express-validator/check");

function validateEmail() {
  return [
    body("email")
      .isEmail()
      .withMessage("Email is not valid")
  ];
}

function returnErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("errors", errors.array());
    res.redirect("/");
  } else {
    next();
  }
}

module.exports = {
  validateEmail,
  returnErrors
};
