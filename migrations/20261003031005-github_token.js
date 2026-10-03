"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("github_tokens", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // 👈 1 คนมี 1 Token เท่านั้น
      },
      token: {
        type: Sequelize.TEXT, // 👈 รองรับ Token ยาว หรือ Encrypted Token
        allowNull: false,
      },
      github_name: {
        type: Sequelize.STRING,
        allowNull: true, // 👈 เก็บไว้โชว์ใน UI
      },
      github_username: {
        type: Sequelize.STRING,
        allowNull: true, // 👈 เก็บไว้โชว์ใน UI
      },
      github_avatar: {
        type: Sequelize.STRING,
        allowNull: true, // 👈 เก็บรูปไว้โชว์ใน UI
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("github_tokens");
  },
};
