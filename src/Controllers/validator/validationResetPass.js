const { body, validationResult } = require("express-validator");
const validationResetPass = () => {
  return [
    body("password")
      .isLength({ min: 6, max: 20 })
      .withMessage("password must be between 6 and 20 characters")
      .matches(/^(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/)
      .withMessage(
        "Password must contain at least one uppercase letter and one special character"
      )
      .notEmpty(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and confirm password does not match");
      }
      return true;
    }),
  ];
};
module.exports = validationResetPass;
