const express = require("express");



const {creatingBlog,uploadFile} = require("../Controllers/bloggerController/creatingBlog");

const categoryBlog = require("../Controllers/bloggerController/categoryBlog");

const {showAllBlog, showBlogById} = require("../Controllers/bloggerController/showAllBlog");

const deletingBlog = require("../Controllers/bloggerController/deletingBlog");

/////////////
const router = express.Router();
router.use(express.json());

/////////////
router.post("/", uploadFile, creatingBlog);
router.get("/category", categoryBlog);
router.get("/", showAllBlog)
router.get("/:blog_id", showBlogById)
router.patch("/remove-blog/:id", deletingBlog);

module.exports = router;