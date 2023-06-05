const express = require("express");
const router = express.Router();
const {
  createTask,
  getTask,
  deleteTask,
} = require("../Controller/task_controller");

router.route("/create").post(createTask);
// get task created by the creator only
router.route("/get").post(getTask);

// delete a task
// only creator can delete the task
router.route("/delete/:_id").delete(deleteTask);

module.exports = router;
