import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";

const loginAccount = express.Router();
loginAccount.use(express.json());

let users = [];

loginAccount.post(
  "/api/auth/login",
  [
    body("usernameOrEmailOrPhone")
      .notEmpty()
      .withMessage("Username, email, or phone number is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { usernameOrEmailOrPhone, password } = req.body;

    const user = users.find(
      (user) =>
        user.username === usernameOrEmailOrPhone ||
        user.email === usernameOrEmailOrPhone ||
        user.phone === usernameOrEmailOrPhone
    );
    if (!user) {
      return res.status(400).json({ error: "Invalid username/email/phone or password" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username/email/phone or password" });
    }

    res.json({ message: "Login successful" });
  }
);

export default loginAccount;
