const { body, validationResult } = require("express-validator");
const validationChangePhone = () => {
    return [
      body("oldPhone")
        .isLength({ min: 3, max: 20 })
        .withMessage("Phone must be between 3 and 20 characters"),
      body("newPhone")
        .isLength({ min: 3, max: 20 })
        .withMessage("Phone must be between 3 and 20 characters"),
    ];
  };
  module.exports = validationChangePhone