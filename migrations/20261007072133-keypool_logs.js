"use strict";

const { describe } = require("node:test");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("keypool_logs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      yearid: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      yearitem: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      yearnumber: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      keyname: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      keyvalue: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("keypool_logs");
  },
};
