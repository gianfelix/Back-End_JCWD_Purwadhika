const path = require("path");
const JWT = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const USER = require("../../models/users");
const nodemailer = require("nodemailer");
// const sendMailEmail = require("./sendMailEmail");
const JWT_KEY = process.env.JWT_KEY;
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const validationChangeEmail = () => {
  return [
    body("oldEmail")
      .isEmail()
      .notEmpty()
      .withMessage("Please enter your old email"),
    body("newEmail")
      .isEmail()
      .notEmpty()
      .withMessage("Please enter your new email"),
  ];
};

const changeEmailAccount = async (req, res) => {
  const { oldEmail, newEmail } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "Invalid tokens" });
  }

  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ errors: err.array() });
  }

  const sendMailEmail = async (email) => {
    const porter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: process.env.user_Hotmail,
        pass: process.env.pass_Hotmail,
      },
    });
  
    const settingsEmail = {
      from: process.env.user_Hotmail,
      to: newEmail,
      subject: "Change Email",
      html: `<html><body>
              <h1>Change Email</h1>
              <p>You are receiving this email because you (or someone else) have requested the change of your email. </p>
              <p>Please click on the following link to change your email:</p>
              <a href="http://localhost:3000/change-email/${token}"
              style="display: inline-block;
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;">Change Email</a>
                <p>If you did not request this, please ignore this email and your email will remain unchanged.</p>
              </body></html>`,
    };
  
    await porter.sendMail(settingsEmail);
  };

  let user_id;
  try {
    const decodedToken = JWT.verify(token, JWT_KEY);
    user_id = decodedToken.user_id;
    console.log(user_id);
  } catch (err) {
    console.log(decodedToken);
    return res.status(400).json({ error: "Invalid tokens user" });
  }

  try {
    const user = await USER.findOne({ where: { user_id: user_id } });
    if (!user) {
      return res.status(400).json({ error: "User invalid" });
    }

    if (user.email !== oldEmail) {
      return res.status(400).json({ error: "Email not match" });
    }

    const userInUser = await USER.findOne({ where: { email: newEmail } });
    if (userInUser) {
      return res.status(400).json({ error: "Email already exist" });
    }

    const userUpdate = await USER.update(
      { email: newEmail, isverified: false },
      { where: { user_id: user_id } }
    );

    await sendMailEmail(userUpdate.email);

    return res.status(200).json({
      message: "Change email success",
      userUpdate,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Invalid tokens/ not success" });
  }
};

module.exports = {
  validationChangeEmail,
  changeEmailAccount,
};
