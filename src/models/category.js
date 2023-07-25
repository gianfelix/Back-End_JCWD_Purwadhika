const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    "Category",
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "category",
      timestamps: true,
      createdAt: "created_at", 
      updatedAt: "updated_at", 
    }
  );
  return Category;
};