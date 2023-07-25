const path = require("path");
const JWT = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../../models");
const USER = db.User;
const sendMailUsername = require("../sendMailController/sendMailUsername");
const JWT_KEY = process.env.JWT_KEY;
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const changeUsernameAccount = async (req, res) => {
  const { oldUsername, newUsername } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(400).json({ error: "Invalid tokens" });

  const err = validationResult(req);
  if (!err.isEmpty()) return res.status(400).json({ errors: err.array() });

  try {
    const { user_id } = JWT.verify(token, JWT_KEY);
    const user = await USER.findOne({ where: { user_id } });
    if (!user) return res.status(400).json({ error: "User invalid" });

    if (user.username !== oldUsername) return res.status(400).json({ error: "Username not match" });

    const userInUse = await USER.findOne({ where: { username: newUsername } });
    if (userInUse) return res.status(400).json({ error: "Username already in use" });

    const userUpdate = await USER.update({ username: newUsername }, { where: { user_id } });

    await sendMailUsername(user.email);

    return res.status(200).json({ message: "Username changed successfully with new username", userUpdate });
  } catch (err) {return res.status(500).json({ error: err.message })
  }
};

module.exports = changeUsernameAccount