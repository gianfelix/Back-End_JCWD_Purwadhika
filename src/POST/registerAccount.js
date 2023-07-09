import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";

const registAccount = express.Router();
registAccount.use(express.json());

let users = [];

registAccount.post(
  "/api/auth/register",
  [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 15 })
      .withMessage("Username must be between 3 and 15 characters"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .withMessage(
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character"
      ),
    body("confirmPassword").custom((value, { req }) => {
      // Check if password and confirmPassword match
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    body("email")
      .isEmail()
      .withMessage("Email is invalid")
      .notEmpty()
      .withMessage("Email is required"),
    body("phone")
      .notEmpty()
      .withMessage("Phone is required")
      .isLength({ min: 10, max: 13 })
      .withMessage("Phone must be between 10 and 13 characters"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password, confirmPassword, email, phone } = req.body;

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    console.log("existing user: ", existingUser);

    const hashedPassword = bcrypt.hashSync(password, 10);
    const hashedConfirmPassword = bcrypt.hashSync(confirmPassword, 10);

    const newUser = {
      username,
      email,
      phone,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
    };
    console.log("new user: ",newUser);

    users.push(newUser);
    res.send("User registration successful");
  }
);

export default registAccount;
