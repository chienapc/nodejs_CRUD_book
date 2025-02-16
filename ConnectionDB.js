const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("store", "root", "spring", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

const connectionDatabse = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

connectionDatabse()