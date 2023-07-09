import express from "express";
import jwt from "jsonwebtoken";

const keepLogin = express.Router();

const JWT = "secret-key";

keepLogin.get("/api/auth", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT);

    // Anda dapat melakukan pengecekan tambahan, seperti mengecek apakah token masih valid di database atau tidak

    // Jika pengecekan tambahan berhasil, Anda dapat mengirimkan informasi user yang valid
    const user = {
      userId: decodedToken.userId,
      username: "antoni123",
      email: "antoni1@gmail.com",
      phone: "081802843865",
      lastLogin: new Date(),
    };

    return res.status(200).json({ message: "Keep login successful", user });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default keepLogin;
