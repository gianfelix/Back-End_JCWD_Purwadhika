"use strict";

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
    return queryInterface.bulkInsert("Users", [
      {
        user_id: "1",
        username: "exampleUser",
        password: "password",
        phone: '081803842421',
        email: "example@example.com",
        avatar: "avatarURL",
        isverified: true,
        created_At: new Date(),
        updated_At: new Date(),
      },
      {
        user_id: "2",
        username: "exampleUser2",
        password: "password32",
        phone: '081803841564',
        email: "example4321@example.com",
        avatar: "avatarURL",
        isverified: true,
        created_At: new Date(),
        updated_At: new Date(),
      },
      {
        user_id: "3",
        username: "exampleUser3",
        password: "password34",
        phone: '083503841564',
        email: "example123@example.com",
        avatar: "avatarURL",
        isverified: false,
        created_At: new Date(),
        updated_At: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users', null, {});
  },
};
