'use strict';


let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}




/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkCreate('bookings', [
      {
        spotId: 1,
        userId: 1,
        startDate : '2022-10-10',
        endDate : '2023-10-10'
      }
    ])
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

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
    */
    await queryInterface.bulkDelete('bookings', null, {});
    options.tableName = "bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
