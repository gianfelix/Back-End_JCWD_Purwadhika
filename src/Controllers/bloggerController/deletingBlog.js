const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const db = require("../../models");
const Blog = db.blog;

const deletingBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findOne({ where: { blog_id: id } });
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    await Blog.destroy({ where: { blog_id: id } });
    res.status(200).json({
      message: "Delete Blog Success",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = deletingBlog;
