const { body, validationResult } = require("express-validator");
const validationForgotPass = () => {
  return [body("email").isEmail().withMessage("Email must be valid")];
};
module.exports = validationForgotPass;
