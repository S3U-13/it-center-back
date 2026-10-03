require("dotenv").config();

const config = {
  development: {
    username: process.env.DBUSER_USER,
    password: process.env.DBUSER_PASS,
    database: process.env.DBUSER_NAME,
    host: process.env.DBUSER_HOST,
    port: Number(process.env.DBUSER_PORT) || 3306,
    dialect: process.env.DBUSER_DIALECT || "mysql",
  },
  test: {
    username: process.env.DBUSER_USER,
    password: process.env.DBUSER_PASS,
    database: process.env.DBUSER_NAME,
    host: process.env.DBUSER_HOST,
    port: Number(process.env.DBUSER_PORT) || 3306,
    dialect: process.env.DBUSER_DIALECT || "mysql",
  },
  production: {
    username: process.env.DBUSER_USER,
    password: process.env.DBUSER_PASS,
    database: process.env.DBUSER_NAME,
    host: process.env.DBUSER_HOST,
    port: Number(process.env.DBUSER_PORT) || 3306,
    dialect: process.env.DBUSER_DIALECT || "mysql",
  },
};

module.exports = config;
