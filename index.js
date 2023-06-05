const express = require("express");
require("dotenv").config();
const dbUtils = require("./utils/dbutils");
const app = express();

app.use(express.json());
const PORT = process.env.PORT;

dbUtils.initDB();

app.get("/", (req, res) => {
  res.send("welcome to the first page of the site");
});

app.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});

process.on("SIGINT", () => {
  dbUtils.disconnectDB();
  console.log("closing the server");
  process.exit();
});

process.on("exit", () => {
  console.log("server closed ");
});
