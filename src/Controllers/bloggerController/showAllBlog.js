const db = require("../../models");
const Category = db.Category;
const Country = db.Country;
const User = db.User;
const Blog = db.blog;

const { Sequelize, Op } = require("sequelize");

const showAllBlog = async (req, res) => {
    try {
        const limit = 10
        const page = req.query.page || 1
        const offset = (page - 1) * limit
        const title = req.query.title || ""
        const category_id = req.query.category_id || ""
        const username = req.query.username || ""
        const sort = req.query.sort || "ASC"

        const find = {};
        if (title) {
            find.title = {
                [Op.like]: `%${title}%`,
            };
        }
        if (category_id) {
            find.category_id = category_id;
        }
        if (username) {
            find.username = username;
        }

        const sortBy = sort === "ASC" ? "ASC" : "DESC";

        const { count: total, rows: blogs } = await Blog.findAndCountAll({
            order: [
                ["created_at", sortBy],
            ],
            include: [
                {
                    model: Category,
                    attributes: ["category_id", "category"],
                },
                {
                    model: Country,
                    attributes: ["country_id", "country"],
                },
                {
                    model: User,
                    attributes: [],
                    as: "User",
                },
            ],

            where: find,
            attributes: [
                "blog_id",
                "title",
                "keyword",
                [Sequelize.literal("`user`.`username`"),
                "author"
            ],
            "image_url",
            "video_url",
            "content",
            "created_at",
            [Sequelize.literal("`category`.`category`"), "category"],
            [Sequelize.literal("`country`.`country`"), "country"],
            ],
            offset,
            limit,
        })

        const pageTotal = Math.ceil(total / limit)
      return res.status(200).json({
        pageTotal,
        pages: page,
        totalBlogs: blogs.length,
        total,
        blogResults: blogs,
        })
    } catch (err) {
        console.error(err);
       return res.status(500).json({ error: err.message });
    }
}

const showBlogById = async (req, res) => {
    try {
      const blogId = req.params.blog_id;
  
      const blog = await Blog.findOne({
        where: { blog_id: blogId },
        include: [
          {
            model: Category,
            attributes: ["category_id", "category"],
          },
          {
            model: Country,
            attributes: ["country_id", "country"],
          },
          {
            model: User,
            attributes: [],
            as: "User",
          },
        ],
        attributes: [
          "blog_id",
          "title",
          "keyword",
          [Sequelize.literal("`user`.`username`"), "author"],
          "image_url",
          "video_url",
          "content",
          "created_at",
          [Sequelize.literal("`category`.`category`"), "category"],
          [Sequelize.literal("`country`.`country`"), "country"],
        ],
      });
  
      if (!blog) {
        return res.status(404).json({ error: "Blog not found" });
      }
  
      return res.status(200).json({ blog });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  };

module.exports = {showAllBlog, showBlogById}