const path = require("path");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../../models");
const USER = db.User;
const bcrypt = require("bcrypt");
const JWT_KEY = process.env.JWT_KEY;
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const resetPasswordAccount = async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });

  const { password } = req.body;
  const tokens = req.headers.authorization?.split(" ")[1];

  if (!tokens) return res.status(400).json({ error: "Invalid tokens" });

  try {
    const { username } = JWT.verify(tokens, JWT_KEY);
    const user = await USER.findOne({ where: { username } });

    if (!user) return res.status(400).json({ error: "Invalid user" });

    const hashPass = await bcrypt.hash(password, 10);

    await USER.update({ password: hashPass, },{ where: { username },});

    return res.status(200).json({ message: "Reset password success",});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = resetPasswordAccount
