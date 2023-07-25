const path = require("path");
const JWT = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../../models");
const USER = db.User;
const nodemailer = require("nodemailer");
const sendMailEmail = require("../sendMailController/sendMailEmail");
const JWT_KEY = process.env.JWT_KEY;
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const changeEmailAccount = async (req, res) => {
  const { oldEmail, newEmail } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(400).json({ error: "Invalid tokens" });
  
  const err = validationResult(req);
  if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });

  try {
    const { user_id } = JWT.verify(token, JWT_KEY);
    const user = await USER.findOne({ where: { user_id } });
    if (!user) return res.status(400).json({ error: "User invalid" });

    if (user.email !== oldEmail)
      return res.status(400).json({ error: "Email not match" });
    const userInUser = await USER.findOne({ where: { email: newEmail } });

    if (userInUser) return res.status(400).json({ error: "Email already exists" });
    const userUpdate = await USER.update(
      { email: newEmail, isverified: false },{ where: { user_id } }
    );

    await sendMailEmail(userUpdate.email, newEmail, token);
    return res.status(200).json({ message: "Change email success", userUpdate });
  } catch (err) {return res.status(400).json({ error: "Invalid tokens/ not success" })}
};

module.exports = changeEmailAccount;
