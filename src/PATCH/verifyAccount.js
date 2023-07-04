import express from "express";
import jwt from "jsonwebtoken";

const verifyAccount = express.Router();
verifyAccount.use(express.json());

let users = [];

verifyAccount.patch("/api/auth/verify/:token", (req, res) => {
  const token = req.params.token;

  const headers = req.headers;
  headers["Content-Type"] = "application/json";
  headers["Authorization"] = `Bearer ${req.headers.authorization}`; // Gunakan token akses yang disimpan dalam header Authorization

  try {
    const decoded = jwt.verify(token, "your-secret-key", { headers });

    const user = users.find((user) => user.email === decoded.email);
    if (!user) {
      return res.status(400).json({ success: false, err: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, err: "Account already verified" });
    }

    user.isVerified = true;
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
});

export default verifyAccount;
