const path = require("path");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const USER = require("../../models/users");
const bcrypt = require("bcrypt");
const JWT_KEY = process.env.JWT_KEY;

const validationChangeUsername = () => {
    return [
        body("oldUsername").isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters"),
        body("newUsername").isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters")
    ]
}

const sendMail = async (email) => {
    const porter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            user: process.env.user_Hotmail,
            pass: process.env.pass_Hotmail,
        },
    })

    const settingsEmail = {
        from: process.env.user_Hotmail,
        to: email,
        subject: "Change Username",
        html: `<html><body>
        <h1>Change Username</h1>
        <p>You are receiving this email because you (or someone else) have requested the change of your username.</p>
        <p>Please click the link below to change your username:</p>
        <a href="http://localhost:3000/change-username/${token}"style="display: inline-block;
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;">Change Username</a>
        <p>If you did not request this, please ignore this email and your username will remain unchanged.</p>
        </body></html>`
    }
    await porter.sendMail(settingsEmail)
}

const changeUsernameAccount = async (req, res) => {
    const { oldUsername, newUsername } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(400).json({ error: "Invalid tokens" });
    }

    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array() });
    }

    let userAccountId = "";
    try {
        const decodedToken = JWT.verify(token, JWT_KEY);
        userAccountId = decodedToken.user_id;
    } catch (err) {
        return res.status(400).json({ error: "Invalid tokens" });
    }

    try {
        const user = await USER.findOne({ where: { user_id: userAccountId } });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        if 
    }
}