const express = require("express");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const USER = require("../../models/users");
const JWT_KEY = process.env.JWT_KEY;

const keepLoginAccount = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];

  try{
    const decodedToken = JWT.verify(token, JWT_KEY);
    const username = decodedToken.username;
    const user_id = decodedToken.user_id;
    const phone = decodedToken.phone;
    const email = decodedToken.email;
    const isverified = decodedToken.isverified;
    const user = await USER.findOne({
      where: {
        username: username,
        user_id: user_id,
        phone: phone,
        email: email,
        isverified: isverified,
      },
      attributes: ["user_id", "username", "email", "phone", "isverified"]
    });

    if (!user) {
      return res.status(404).json({
        message: "Account not found",
      });
    }
    res.status(200).json({
      user, message: "Keep Login Account",
    })
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = keepLoginAccount;