"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. ตาราง Roles หลัก
    await queryInterface.createTable("itcenter_roles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      role_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true, // 'super_admin', 'it_devops', 'it_programmer', 'it_support'
      },
      role_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // 2. ผูก User กับหลาย Roles (1 คนมีได้หลาย Role)
    await queryInterface.createTable(
      "itcenter_user_roles",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userid: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        role_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        uniqueKeys: {
          unique_user_role: {
            fields: ["userid", "role_id"],
          },
        },
      },
    );

    // 3. สิทธิ์พิเศษเฉพาะบุคคล (User-level Custom Overrides)
    await queryInterface.createTable(
      "itcenter_user_permissions",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userid: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        permission_key: {
          type: Sequelize.STRING(100),
          allowNull: false, // 'docker:prune', 'server_directory:edit', '*'
        },
        is_granted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        uniqueKeys: {
          unique_user_permission: {
            fields: ["userid", "permission_key"],
          },
        },
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("itcenter_user_permissions");
    await queryInterface.dropTable("itcenter_user_roles");
    await queryInterface.dropTable("itcenter_roles");
  },
};
