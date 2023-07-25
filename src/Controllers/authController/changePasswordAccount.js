const path = require("path");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../../models");
const USER = db.User;
const bcrypt = require("bcrypt");
const JWT_KEY = process.env.JWT_KEY;
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const changePasswordAccount = async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });
  
    const { oldPassword, password } = req.body;
    const tokens = req.headers["authorization"].split(" ")[1];
    if (!tokens) return res.status(400).json({ error: "Invalid tokens" });
  
    let username = "";
    try {
      const decodedToken = JWT.verify(tokens, JWT_KEY);
      username = decodedToken.username;
    } catch (err) {return res.status(400).json({ error: "Invalid tokens" });}
  
    try {
      const userCheck = await USER.findOne({ where: { username } });
      if (!userCheck) return res.status(400).json({ error: "Invalid user" });
      const matchingPass = await bcrypt.compare(oldPassword, userCheck.password);
      if (!matchingPass) return res.status(400).json({ error: "Invalid old password" });
  
      const hashPass = await bcrypt.hash(password, 20);
      await USER.update({ password: hashPass }, { where: { username } });

      return res.status(200).json({ message: "Password changed successfully with new password" });
    } catch (err) {return res.status(500).json({ error: err.message })}
};

module.exports = changePasswordAccount
