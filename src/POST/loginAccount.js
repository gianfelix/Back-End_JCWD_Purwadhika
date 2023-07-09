import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginAccount = express.Router();
loginAccount.use(express.json());

const users = [
  {
    id: 1,
    username: "antoni123",
    email: "antoni1@gmail.com",
    phone: "081802843865",
    password: "Antoni123!",
  },
];

const JWT = "secret-key";

loginAccount.post(
  "/api/auth/login",
  [
    body("identifier")
      .notEmpty()
      .withMessage("Username, email, or phone number is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, password } = req.body;

    const user = users.find(
      (user) =>
        (user.username === identifier ||
          user.email === identifier ||
          user.phone === identifier) &&
        user.password === password
    );
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid username/email/phone or password" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sessionInfo = {
      userId: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: hashedPassword,
      lastLogin: new Date(),
    };

    const token = jwt.sign({ userId: user.id }, JWT, { expiresIn: "2h" });

    return res
      .status(200)
      .json({ message: "Login successful", token, sessionInfo });
  }
);

export default loginAccount;
