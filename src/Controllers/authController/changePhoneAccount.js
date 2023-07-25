const path = require("path");
const JWT = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const db = require("../../models");
const USER = db.User;
const JWT_KEY = process.env.JWT_KEY;
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const sendMailPhone = require("../sendMailController/sendMailPhone");

const changePhoneAccount = async (req, res) => {
  const { oldPhone, newPhone } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(400).json({ error: "Invalid tokens" });

  const err = validationResult(req);
  if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });

  try {
    const { user_id } = JWT.verify(token, JWT_KEY);
    const user = await USER.findOne({ where: { user_id } });
    if (!user) return res.status(400).json({ error: "User invalid" });

    if (user.phone !== oldPhone) return res.status(400).json({ error: "Phone not match" });

    const userUpdate = await USER.update({ phone: newPhone }, { where: { user_id } });

    await sendMailPhone(user.email);

    return res.status(200).json({ message: "Change phone number success with new phone", userUpdate });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = changePhoneAccount