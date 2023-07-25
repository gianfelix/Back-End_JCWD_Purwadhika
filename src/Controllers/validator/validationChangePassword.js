const { body, validationResult } = require("express-validator");
const validationChangePassword = () => {
  return [
    body("oldPassword")
      .isLength({ min: 6, max: 20 })
      .withMessage("password must be between 6 and 20 characters"),
    body("password")
      .isLength({ min: 6, max: 20 })
      .withMessage("password must be between 6 and 20 characters")
      .matches(/^(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/)
      .withMessage(
        "Password must contain at least one uppercase letter and one special character"
      ),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password && value !== req.body.oldPassword) {
        throw new Error("Password and confirm password does not match");
      }
      return true;
    }),
  ];
};

module.exports = validationChangePassword