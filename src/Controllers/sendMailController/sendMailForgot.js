const nodemailer = require("nodemailer");
const db = require("../../models");
const USER = db.User;
const JWT = require("jsonwebtoken");

const sendMailForgot = async (email) => {
  const porter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.user_Hotmail,
      pass: process.env.pass_Hotmail,
    },
  });

  const user = await USER.findOne({ where: { email: email } });

  const token = JWT.sign(
    {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      phone: user.phone,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "3h",
    }
  );

  const settingsEmail = {
    from: process.env.user_Hotmail,
    to: email,
    subject: "Reset Password",
    html: `
    <html>
    <body>
      <h1>Reset Password</h1>
      <p>You are receiving this email because you (or someone else) have requested the reset of a password for your account.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="http://localhost:3000/reset-password/${token}"
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
              cursor: pointer;">Reset Password</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    </body>
    </html>`,
  };
  await porter.sendMail(settingsEmail);
};

module.exports = sendMailForgot;
