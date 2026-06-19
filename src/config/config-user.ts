// import * as dotenv from "dotenv";
// dotenv.config();

const config = {
  development: {
    username: process.env.DBUSER_USER,
    password: process.env.DBUSER_PASS,
    database: process.env.DBUSER_NAME,
    host: process.env.DBUSER_HOST,
    port: process.env.DBUSER_PORT,
    dielect: process.env.DBUSER_DIALECT,
  },
  test: {
    username: process.env.DBUSER_USER,
    password: process.env.DBUSER_PASS,
    database: process.env.DBUSER_NAME,
    host: process.env.DBUSER_HOST,
    port: process.env.DBUSER_PORT,
    dielect: process.env.DBUSER_DIALECT,
  },
  production: {
    username: process.env.DBUSER_USER,
    password: process.env.DBUSER_PASS,
    database: process.env.DBUSER_NAME,
    host: process.env.DBUSER_HOST,
    port: process.env.DBUSER_PORT,
    dielect: process.env.DBUSER_DIALECT,
  },
};
export default config;
