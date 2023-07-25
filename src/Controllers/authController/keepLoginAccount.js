const express = require("express");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const db = require("../../models");
const USER = db.User;
const JWT_KEY = process.env.JWT_KEY;

const keepLoginAccount = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];

  try {
    const { username, user_id, phone, email, isverified } = JWT.verify(token, JWT_KEY);
    const user = await USER.findOne({
      where: { username, user_id, phone, email, isverified },
      attributes: ["user_id", "username", "email", "phone", "isverified"]
    });

    if (!user) return res.status(404).json({ message: "Account not found" });

    res.status(200).json({ user, message: "Keep Login Account Success" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = keepLoginAccount;