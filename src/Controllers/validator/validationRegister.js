const { body, validationResult } = require("express-validator");
const db = require("../../models");
const User = db.User;
const nodemailer = require("nodemailer");
const validationRegister = () => {
  return [
    body("username").isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters")
      .custom(async (value) => {
        const user = await User.findOne({ where: { username: value } });
        if (user) {throw new Error("Username already registered");}
        return true}),
    body("password").isLength({ min: 6, max: 20 }).matches(/^(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/).withMessage("Password 6-20 characters, must contain at least one uppercase letter and one special character")
      .notEmpty(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and confirm password does not match");
      } return true}),
    body("email").isEmail().withMessage("Email must be valid")
      .custom(async (value) => {
        const user = await User.findOne({ where: { email: value } });
        if (user) {throw new Error("Email already in use")}
        return true}),
    body("phone")
      .isLength({ min: 10, max: 13 }).withMessage("Phone number must be 10 - 13 digits"),]};

module.exports = validationRegister;
