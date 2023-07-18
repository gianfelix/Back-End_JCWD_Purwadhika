const path = require("path");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const USER = require("../../models/users");
const bcrypt = require("bcrypt");
const sendMailUsername = require("./sendMailUsername");
const JWT_KEY = process.env.JWT_KEY;
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const validationChangeUsername = () => {
    return [
        body("oldUsername").isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters"),
        body("newUsername").isLength({ min: 3, max: 20 }).withMessage("Username must be between 3 and 20 characters")
    ]
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
            return res.status(400).json({ error: "User invalid" });
        }

        if (user.username !== oldUsername) {
            return res.status(400).json({ error: "Username not match" });
        }

        const userInUse = await USER.findOne({ where: { username: newUsername } });
        if (userInUse) {
            return res.status(400).json({ error: "Username already in use" });
        }

        const userUpdate = await USER.update(
            {
                username: newUsername,
            },
            { where: { user_id: userAccountId } }
        )

        await sendMailUsername(user.email);

        return res.status(200).json({
            message: "Username changed successfully with new username", userUpdate
        })
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = {
    validationChangeUsername,
    changeUsernameAccount,
}