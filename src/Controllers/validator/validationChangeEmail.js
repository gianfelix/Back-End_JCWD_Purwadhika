const { body, validationResult } = require("express-validator");
const validationChangeEmail = () => {
  return [
    body("oldEmail")
      .isEmail()
      .notEmpty()
      .withMessage("Please enter your old email"),
    body("newEmail")
      .isEmail()
      .notEmpty()
      .withMessage("Please enter your new email"),
  ];
};

module.exports = validationChangeEmail;
