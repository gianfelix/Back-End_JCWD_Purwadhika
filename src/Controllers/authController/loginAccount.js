const express = require ("express");
const { body, validationResult } = require ("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const JWT = process.env.JWT_SECRET;

const users = [
  {
    id: 1,
    username: "antoni12",
    email: "antoni@gmail.com",
    phone: "081802843865",
    password: "PassNormal!@123",
  },
];

const validateLogin = () => {
    return [
    body("identifier")
      .notEmpty()
      .withMessage("Username, email, or phone number is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ]}
  const loginAccount = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, password } = req.body;

    const user = users.find(
      (user) =>
        (user.username === identifier ||
          user.email === identifier ||
          user.phone === identifier) &&
        user.password === password
    );

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid username/email/phone or password" });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sessionInfo = {
      userId: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: hashedPassword,
      lastLogin: new Date(),
    };

    const token = jwt.sign({ userId: user.id }, JWT, { expiresIn: "2h" });

    return res
      .status(200)
      .json({ message: "Login successful", token, sessionInfo });
  }


module.exports = { validateLogin, loginAccount };
