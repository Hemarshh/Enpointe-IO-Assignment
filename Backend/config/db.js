const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbConnection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log,
  }
);

(async () => {
  try {
    console.log("MySql Database connected successfully.");
    await dbConnection.authenticate();
  } catch (error) {
    console.log("Unable to connect to the database:", error);
  }
})();

module.exports = dbConnection;
