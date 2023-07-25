const { body, validationResult } = require("express-validator");
const validationLogin = () => {
  return [
    body("identifier")
      .notEmpty()
      .withMessage("Username, email, or phone number is required"),
    body("password")
      .isLength({ min: 6, max: 20 })
      .withMessage("password must be between 6 and 20 characters")
      .matches(/^(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/)
      .withMessage(
        "Password must contain at least one uppercase letter and one special character"
      ),
  ];
};

module.exports = validationLogin;