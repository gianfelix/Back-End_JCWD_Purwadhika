const { body, validationResult } = require("express-validator");
const validationChangeUsername = () => {
    return [
      body("oldUsername")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),
      body("newUsername")
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),
    ];
  };
  module.exports = validationChangeUsername;