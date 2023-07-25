const path = require("path");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../../models");
const USER = db.User;
const sendMailForgot = require("../sendMailController/sendMailForgot");

const forgotPasswordAccount = async (req, res) => {
  const err = validationResult(req);

  if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });

  const { email } = req.body;

  try {
    const user = await USER.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    await sendMailForgot(email);
    return res.status(200).json({ message: "Reset password email sent" });
  } catch (err) {
    return res.status(500).json({ message: "Sending email failed", error: err.message });
  }
};

module.exports = forgotPasswordAccount;
