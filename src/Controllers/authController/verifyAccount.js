const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../models");
const USER = db.User;
const path = require("path");
const express = require("express");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const JWT_KEY = process.env.JWT_KEY;

const tokenVerify = new Map();
const verifyAccount = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token || tokenVerify.get(token) < Date.now()) {
      return res.status(401).json({ error: "Unauthorized/ Token Invalid" });
    }

    const decodedToken = JWT.verify(token, JWT_KEY);
    const username = decodedToken.username;

    const [updated] = await USER.update({ isverified: true }, { where: { username } });

    if (updated === 0) {
      return res.status(404).json({ message: "Account not found", });
    }

    tokenVerify.set(token, decodedToken.exp * 5);
    return res.status(200).json({
      message: "Account has been verified",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = verifyAccount;
