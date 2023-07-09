const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const JWT_SECRET = process.env.JWT_SECRET;

let users = [];

validateRegister = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 4, max: 15 })
      .withMessage("Username must be between 4 and 15 characters")
      .custom((values) => {
        const findUser = users.find((user) => user.username === values);
        if (findUser) {
          throw new Error("Username already exists");
        }
        return true;
      }),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 5, max: 20 })
      .withMessage("Password must be between 5 and 20 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .withMessage(
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character"
      ),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    body("email")
      .isEmail()
      .withMessage("Email is invalid")
      .notEmpty()
      .withMessage("Email is required"),
    body("phone")
      .isLength({ min: 10, max: 13 })
      .withMessage("Phone number must be between 10 and 13 characters")
      .notEmpty()
      .withMessage("Phone number is required"),
  ];
};

const register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array(), message: "ERROR" });
  }
  const { username, password, email, phone } = req.body;

  const findUser = users.find((user) => user.email === email);
  if (findUser) {
    return res.status(400).json({ error: "Email already exists", message: "ERROR" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    username,
    password: hashedPassword,
    email,
    phone,
  };
  users.push(newUser);

  // Token JWT expires in 2 hours
  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
    expiresIn: "2h",
  });

  res.json({ message: "Register successful", token });
};

module.exports = { register, validateRegister };
