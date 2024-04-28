"use strict";

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "/bird7.jpg",
        preview: true,
      },
      {
        spotId: 1,
        url: "/bird3.jpg",
        preview: false,
      },
      {
        spotId: 1,
        url: "/bird3.jpg",
        preview: false,
      },
      {
        spotId: 1,
        url: "/bird3.jpg",
        preview: false,
      },
      {
        spotId: 1,
        url: "/bird3.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "/bird2.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "/bird4.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "/bird4.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "/bird4.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "/bird4.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "/bird3.jpg",
        preview: true,
      },
      {
        spotId: 3,
        url: "image url",
        preview: false,
      },
      {
        spotId: 3,
        url: "image url",
        preview: false,
      },
      {
        spotId: 3,
        url: "image url",
        preview: false,
      },
      {
        spotId: 3,
        url: "image url",
        preview: false,
      },
      {
        spotId: 4,
        url: "image url",
        preview: true,
      },
      {
        spotId: 4,
        url: "image url",
        preview: false,
      },
      {
        spotId: 4,
        url: "image url",
        preview: false,
      },
      {
        spotId: 4,
        url: "image url",
        preview: false,
      },
      {
        spotId: 4,
        url: "image url",
        preview: false,
      },
      {
        spotId: 5,
        url: "image url",
        preview: true,
      },
      {
        spotId: 5,
        url: "image url",
        preview: false,
      },
      {
        spotId: 5,
        url: "image url",
        preview: false,
      },
      {
        spotId: 5,
        url: "image url",
        preview: false,
      },
      {
        spotId: 5,
        url: "image url",
        preview: false,
      },
    ],
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  },
};
