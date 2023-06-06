const express = require("express");
const router = express.Router();
const {
  createTask,
  getTask,
  deleteTask,
  getalltask,
  editTask,
} = require("../Controller/task_controller");

const { verifyToken } = require("../Controller/auth_controller");

router.route("/create").post(verifyToken, createTask);
// get task created by the creator only
router.route("/get").get(verifyToken, getTask);

// delete a task
// only creator can delete their task
router.route("/delete/:_id").delete(verifyToken, deleteTask);

// Administration role based authorizations
// admin can view all total task presnet into the db
router.route("/administration").get(verifyToken, getalltask);

// to edit a task
// router.route("/edit/task").put(verifyToken, editTask);

module.exports = router;
