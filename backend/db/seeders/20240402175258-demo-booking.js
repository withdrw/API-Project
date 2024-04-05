"use strict";


const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: new Date("2024-10-10"),
        endDate: new Date("2024-10-11"),
      },
      {
        spotId: 1,
        userId: 1,
        startDate: new Date("2024-11-06"),
        endDate: new Date("2024-11-11"),
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date("2022-10-10"),
        endDate: new Date("2023-10-10"),
      },
    ],

    );
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  },
};
