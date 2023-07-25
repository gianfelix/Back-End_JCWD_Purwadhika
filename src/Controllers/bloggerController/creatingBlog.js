const multer = require("multer");
const path = require("path");
// const USER = require("../../models/users");
// const BLOG = require("../../models/blogs");
// const COUNTRY = require("../../models/country");
// const CATEGORY = require("../../models/category");
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const db = require("../../models");
const Category = db.Category
const Country = db.Country
const User = db.User
const blog = db.blog

const JWT = require("jsonwebtoken");

const fs = require("fs");

const blogPicDir = path.join(__dirname, "../../public/images");

const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, blogPicDir);
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1000);
    cb(null, unique + path.extname(file.originalname));
  },
});

const filter = (req, file, cb) => {
  const extensionsFile = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];

  if (!extensionsFile.includes(path.extname(file.originalname).toLowerCase())) {
    cb("file type not allowed, only png, jpg, jpeg, gif, svg, and webp", false);
  } else {
    cb(null, true);
  }
};

const uploadFile = multer({
  storage: store,
  fileFilter: filter,
}).single("image");

const creatingBlog = async (req, res) => {
  try {

      const { title, keyword, video_url, content, category_id, country_id } =
        req.body;

      const TOKEN = req.headers.authorization.split(" ")[1];
      if (!TOKEN) {
        return res.status(400).json({ error: "Invalid/ missing tokens" });
      }

      const decodedToken = JWT.verify(TOKEN, process.env.JWT_KEY);
      const user_id = decodedToken.user_id;

      const isverified = await User.findOne({
        where: {
          user_id,
          isverified: true,
        },
      });

      if (!isverified) {
        return res.status(400).json({ error: "Account not verified" });
      }

      const category = await Category.findOne({
        where: {
          category_id,
        },
      });

      if (!category) {
        return res
          .status(400)
          .json({ error: "Category not found/ wrong category" });
      }

      const country = await Country.findOne({
        where: {
          country_id,
        },
      });
      if (!country) {
        return res
          .status(400)
          .json({ error: "Country not found/ wrong country" });
      }

      const imageURL = req.file ? req.file.path : "";
      const findPath = imageURL.replace(/^.*public[\\\/]/, "");

      const blogger = await blog.create({
        user_id: user_id,
        title,
        content,
        keyword,
        category_id,
        country_id,
        created_at: new Date(),
        image_url: findPath,
        video_url,
      });
      return res.status(200).json({ message: "Blog created", blogger });
    
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {creatingBlog, uploadFile};
