const path = require("path");
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const USER = require("../../models/users");
const bcrypt = require("bcrypt");
const JWT_KEY = process.env.JWT_KEY;

const validationChangePasword = () => {
    return [
        body("oldPassword")
            .isLength({ min: 6, max: 20 }).withMessage("password must be between 6 and 20 characters"),
        body("password")
            .isLength({ min: 6, max: 20 })
            .withMessage("password must be between 6 and 20 characters")
            .matches(/^(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/)
            .withMessage(
                "Password must contain at least one uppercase letter and one special character"
            ),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password && value !== req.body.oldPassword) {
                throw new Error("Password and confirm password does not match");
            }
            return true;
        }),
    ];
}

const changePasswordAccount = async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array() });
    }

    const { oldPassword, password, confirmPassword } = req.body;

    const tokens = req.headers["authorization"].split(" ")[1];

    if (!tokens) {
        return res.status(400).json({ error: "Invalid tokens" });
    }

    let username = "";
    try {
        const decodedToken = JWT.verify(tokens, JWT_KEY);
        username = decodedToken.username;
    } catch (err) {
        return res.status(400).json({ error: "Invalid tokens" });
    }

    try {
        const user = await USER.findOne({ where: { username: username } });
        if (!user) {
            return res.status(400).json({ error: "Invalid user" });
        }

        const matchingPass = await bcrypt.compare(oldPassword, user.password);

        if (!matchingPass) {
            return res.status(400).json({ error: "Invalid old password" });
        }

        const hashPass = await bcrypt.hash(password, 10);

        await USER.update(
            {
                password: hashPass,
            },
            {
                where: { username: username },
            }
        )

        return res.status(200).json({
            message: "Password changed successfully with new password",
        })
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

module.exports = {
    validationChangePasword,
    changePasswordAccount,
}