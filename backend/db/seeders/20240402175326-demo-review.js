"use strict";


const { Review } = require("../models");


let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: "awesome",
        stars: 4,
      },
      {
        spotId: 1,
        userId: 1,
        review: "This is okay !",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 2,
        review: "awesome",
        stars: 4,
      },
      {
        spotId: 2,
        userId: 2,
        review: "This is okay !",
        stars: 5,
      },
      {
        spotId: 3,
        userId: 3,
        review: "This is okay !",
        stars: 2,
      },
      {
        spotId: 4,
        userId: 3,
        review: "This is okay !",
        stars: 2,
      },
      {
        spotId: 5,
        userId: 4,
        review: "This is okay !",
        stars: 2,
      },
    ],

    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
