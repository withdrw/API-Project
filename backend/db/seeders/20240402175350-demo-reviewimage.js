"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("ReviewImages", [
      {
        reviewId: 1,
        url: "image url",
      },
      {
        reviewId: 2,
        url: "image url",
      },
      {
        reviewId: 3,
        url: "image url",
      },
      {
        reviewId: 4,
        url: "image url",
      },
    ],

    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  },
};
