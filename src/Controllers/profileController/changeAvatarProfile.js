// controllers/userController.js
const multer = require("multer");
const db = require("../../models");
const USER = db.User;
const path = require("path");
const JWT = require("jsonwebtoken");
const fs = require("fs");
const { error } = require("console");

const profilePicDir = path.join(__dirname, "../../public/profile_pic");

const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilePicDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1000);
    cb(null, unique + path.extname(file.originalname));
  },
});

const filter = (req, file, cb) => {
  const extensionsFile = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
  
  if (!extensionsFile.includes(path.extname(file.originalname).toLowerCase())) {
    cb("File type not allowed, only png, jpg, jpeg, gif, svg, and webp", false);
  } else if (file.size > sizeMaxAllowed) {
    cb("File size is too big", false);
  } else {
    cb(null, true);
  }
};

const sizeMaxAllowed = 1048576;

const uploadAvatar = multer({
  storage: store,
  fileFilter: filter,
  limits: { fileSize: sizeMaxAllowed }
}).single("avatar");

const changeAvatarProfile = async (req, res) => {
  try {
       if (!req.file) {
         return res.status(400).json({ error: "File not found/ invalid upload" });
       }
    
    const TOKEN = req.headers.authorization.split(" ")[1];
    if (!TOKEN) {
      return res.status(400).json({ error: "Invalid/ missing tokens" });
    }
    
    const decodedToken = JWT.verify(TOKEN, process.env.JWT_KEY); 
    const pathOrigin = req.file.path;
    const filePath = pathOrigin.replace(/^.*public[\\\/]/, "")
    const user_id = decodedToken.user_id;
    
    await USER.update({ avatar: filePath }, { where: { user_id: user_id } });

    res.status(200).json({
      message: "Avatar Profile updated",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  changeAvatarProfile, uploadAvatar
};
