const nodemailer = require("nodemailer");

const sendMailEmail = async (email, newEmail, token) => {
  const porter = nodemailer.createTransport({
    service: "hotmail",
    auth: { user: process.env.user_Hotmail, pass: process.env.pass_Hotmail },
  });

  const settingsEmail = {
    from: process.env.user_Hotmail,
    to: newEmail,
    subject: "Change Email",
    html: `<html><body><h1>Change Email</h1><p>You are receiving this email because you (or someone else) have requested the change of your email. </p><p> Your email has been changed to: ${newEmail} </p><p>Please click on the following link to change your email:</p><a href="http://localhost:3000/change-email/${token}" style="display: inline-block; background-color: #4CAF50; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Change Email</a><p>If you did not request this, please ignore this email and your email will remain unchanged.</p></body></html>`,
  };

  await porter.sendMail(settingsEmail);
};

module.exports = sendMailEmail;
