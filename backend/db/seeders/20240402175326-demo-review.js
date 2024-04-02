'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}




/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkCreate('reviews', [
      {
        spotId: 1,
        userId : 1,
        review: 'awesome',
        stars : 4
      },
      {
        spotId: 2,
        userId : 2,
        review: 'This is okay !',
        stars : 3
      }
    ])

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('reviews', null, {});
   options.tableName = "review";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
