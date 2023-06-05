const express = require("express");
const router = express.Router();
const {
  createTask,
  getTask,
  deleteTask,
  getalltask,
} = require("../Controller/task_controller");

router.route("/create").post(createTask);
// get task created by the creator only
router.route("/get").post(getTask);

// delete a task
// only creator can delete their task
router.route("/delete/:_id").delete(deleteTask);

// Administration role based authorizations
// admin can view all total task presnet into the db
router.route("/administration/:_id").post(getalltask);

module.exports = router;
