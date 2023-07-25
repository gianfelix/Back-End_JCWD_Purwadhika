const { DataTypes } = require("sequelize");
const USER = require("./users");
const COUNTRY = require("./country");
const CATEGORY = require("./category");

module.exports = (sequelize, Sequelize) => {
  const User = USER(sequelize, Sequelize);
  const Country = COUNTRY(sequelize, Sequelize);
  const Category = CATEGORY(sequelize, Sequelize);
  const blog = sequelize.define(
    "blog",
    {
      blog_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
      },
      keyword: {
        type: DataTypes.STRING,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      image_url: {
        type: DataTypes.STRING,
      },
      video_url: {
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.TEXT,
        validate: {
          len: [0, 500],
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
      },
      country_id: {
        type: DataTypes.INTEGER,
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "blog",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  blog.belongsTo(User, { foreignKey: "user_id" });
  blog.belongsTo(Country, { foreignKey: "country_id" });
  blog.belongsTo(Category, { foreignKey: "category_id" });

  return blog;
};
