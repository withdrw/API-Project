"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.Booking, { foreignKey: "spotId" });
      Spot.hasMany(models.Review, { foreignKey: "spotId" });
      Spot.belongsTo(models.User, {
        as : "Owner",
        foreignKey: "ownerId"
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
      });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull : false
      },
      address: {
        type: DataTypes.STRING
       },
      city: {
        type: DataTypes.STRING
       },
      state: {
        type: DataTypes.STRING
       },
      country: {
        type: DataTypes.STRING
       },
      lat: {
        type: DataTypes.DECIMAL
       },
      lng: {
        type: DataTypes.DECIMAL
       },
      name: {
        type: DataTypes.STRING
       },
      description: {
        type: DataTypes.STRING
       },
      price: {
        type: DataTypes.DECIMAL
       },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
