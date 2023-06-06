const mongoose = require("mongoose");
const logger = require("../config/logger");

const initDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      logger.info("Database connected successfully");
    })
    .catch((error) => {
      console.log(error);
    });
};

const disconnectDB = () => {
  mongoose.disconnect();
  logger.info("Database disconnected successfully");
};

module.exports = { initDB, disconnectDB };
