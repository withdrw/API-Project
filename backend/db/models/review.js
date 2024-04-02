'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      review.hasMany(models.ReviewImage, {
        foreignKey : ' reviewId'
      })
    }
  }
  review.init({
    spotId: {type :DataTypes.INTEGER,
    },
    userId: {type :DataTypes.INTEGER,
    },
    review: {type :DataTypes.STRING,
    },
    stars: {type :DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'review',
  });
  return review;
};
