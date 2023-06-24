const express = require("express");
require("dotenv").config();
const dbUtils = require("./utils/dbutils");
const app = express();
const authRouter = require("./Routes/auth_route");
const taskRouter = require("./Routes/task_route");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("./swagger.json");
const logger = require("./config/logger");

app.use(express.json());
const PORT = process.env.PORT;

dbUtils.initDB();

// app.get("/", (req, res) => {
//   res.send("welcome to the first page of the site");
// });

app.use("/user", authRouter);
app.use("/task", taskRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.listen(PORT, () => {
  logger.info(`app is listening on ${PORT}`);
});

process.on("SIGINT", () => {
  dbUtils.disconnectDB();
  logger.info("closing the server");
  process.exit();
});

process.on("exit", () => {
  logger.info("server closed ");
});
