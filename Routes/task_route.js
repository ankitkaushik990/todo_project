const express = require("express");
const router = express.Router();
const {
  createTask,
  getTask,
  deleteTask,
  getalltask,
  editTask,
  assignTask,
  changeStatus,
} = require("../Controller/task_controller");

const { verifyToken } = require("../Controller/auth_controller");

router.route("/create").post(verifyToken, createTask);
// get task created by the creator only
router.route("/").get(verifyToken, getTask);

// delete a task
// only creator can delete their task
router.route("/:_id").delete(verifyToken, deleteTask);

// Administration role based authorizations
// admin can view all total task presnet into the db
router.route("/administration").get(verifyToken, getalltask);

// to edit a task
router.route("/edit/:_id").put(verifyToken, editTask);

// to addign the task

router.route("/assign/:id").post(verifyToken, assignTask);

// status assign
router.route("/status/:id").post(verifyToken, changeStatus);

module.exports = router;
