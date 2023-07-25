const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Country = sequelize.define(
    "Country",
    {
      country_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "country",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Country;
};
