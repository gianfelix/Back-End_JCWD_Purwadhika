const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const sendMailUsername = async (email) => {
    const porter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: process.env.user_Hotmail,
            pass: process.env.pass_Hotmail,
        },})

    const settingsEmail = {
        from: process.env.user_Hotmail,
        to: email,
        subject: "Change Username",
        html: `<html><body>
        <h1>Change Username</h1>
        <p>Your username has been changed.</p>
        <p>Thank you.</p>
        </body></html>`,}
    await porter.sendMail(settingsEmail)}

module.exports = sendMailUsername