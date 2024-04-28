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
        url: "/preview2.jpg",
        preview: true,
      },
      {
        spotId: 1,
        url: "/Preview1.jpg",
        preview: false,
      },
      {
        spotId: 1,
        url: "/main1.jpg",
        preview: false,
      },
      {
        spotId: 1,
        url: "/main2.jpg",
        preview: false,
      },
      {
        spotId: 1,
        url: "/main3.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "/Preview3.jpg",
        preview: true,
      },
      {
        spotId: 2,
        url: "/main5.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "/main4.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "/main6.jpg",
        preview: false,
      },
      {
        spotId: 2,
        url: "/main7.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "/Preview4.jpg",
        preview: true,
      },
      {
        spotId: 3,
        url: "/main8.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "/main9.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "/main10.jpg",
        preview: false,
      },
      {
        spotId: 3,
        url: "/main11.jpg",
        preview: false,
      },
      {
        spotId: 4,
        url: "/Preview5.jpg",
        preview: true,
      },
      {
        spotId: 4,
        url: "/main12.jpg",
        preview: false,
      },
      {
        spotId: 4,
        url: "/main13.jpg",
        preview: false,
      },
      {
        spotId: 4,
        url: "/main14.jpg",
        preview: false,
      },
      {
        spotId: 4,
        url: "/main15.jpg",
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
    ]);
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
