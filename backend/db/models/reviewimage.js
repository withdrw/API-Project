'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      reviewImage.belongsTo(models.Review, {
        foreignKey : 'reviewId'
      })
    }
  }
  reviewImage.init({
    reviewId: {type :DataTypes.INTEGER,
    },
    url: {type :DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'reviewImage',
  });
  return reviewImage;
};