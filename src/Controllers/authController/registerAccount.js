const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../../models");
const User = db.User;
const nodemailer = require("nodemailer");

const registerAccount = async (req, res) => {
  const token = jwt.sign(
    { username: req.body.username, email: req.body.email, phone: req.body.phone, isverified: false },
    process.env.JWT_KEY,
    { expiresIn: "2h" }
  );

  const linkToVerify = async () => {
    const porter = nodemailer.createTransport({ service: "hotmail", auth: { user: process.env.user_Hotmail, pass: process.env.pass_Hotmail } });
    const settingsEmail = { from: process.env.user_Hotmail, to: req.body.email, subject: "Register Account", html: `<html><body><h1>Register New Account</h1><p>Hello ${req.body.username},</p><p>Thank you for registering!</p><p>Please click the link below to verify your account:</p><a href="http://localhost:3000/verify-account/${token}" style="display: inline-block; background-color: #4CAF50; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Verify Account</a><p>Thank you!</p><p>Regards,</p><p>Gian Felix Ramadan</p></body></html>`, };
    await porter.sendMail(settingsEmail);
  };

  const err = validationResult(req);
  if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });

  const { username, password, email, phone } = req.body;
  try {
    const hashPass = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashPass, email, phone });
    await linkToVerify(req.body.email);
    return res.json({ message: "Register success", token, message: "Check your email for verification" });
  } catch (error) {
    return res.status(500).json({ message: "Register failed" });
  }
};

module.exports = registerAccount;
