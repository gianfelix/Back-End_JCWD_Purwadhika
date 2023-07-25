const db = require("../../models");
const CATEGORY = db.Category


const categoryBlog = async (req, res) => {
    try {
        const category = await CATEGORY.findAll({ attributes: ["category_id","category"],});
        return res.status(200).json({category});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
}

module.exports = categoryBlog