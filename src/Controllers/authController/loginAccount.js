const { body, validationResult } = require("express-validator");
const JWT = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const JWT_KEY = process.env.JWT_KEY;
const USER = require("../../models/users");
const { Op } = require("sequelize");

const validationLogin = () => {
  return [
    body("identifier")
      .notEmpty()
      .withMessage("Username, email, or phone number is required"),
    body("password")
      .isLength({ min: 6, max: 20 })
      .withMessage("password must be between 6 and 20 characters")
      .matches(/^(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/)
      .withMessage(
        "Password must contain at least one uppercase letter and one special character"
      ),
  ];
};

const loginAccount = async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return res.status(400).json({ errors: err.array() });
  }

  const { identifier, password } = req.body;
  try {
    const user = await USER.findOne({
      where: {
        [Op.or]: [
          { username: identifier },
          { email: identifier },
          { phone: identifier },
        ],
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid username/email/phone or password" });
    }

    const passCheck = await bcrypt.compare(password, user.password);
    if (!passCheck) {
      return res
        .status(400)
        .json({ error: "Invalid username/email/phone or password" });
    }

    const session = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      password: user.password,
      isverified: user.isverified,
    };

    const token = JWT.sign(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        isverified: user.isverified,
      },
      JWT_KEY,
      {
        expiresIn: "3h",
      }
    );

    return res.status(200).json({
      message: "Login success",
      data_token: token,
      session,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

module.exports = { validationLogin, loginAccount };
