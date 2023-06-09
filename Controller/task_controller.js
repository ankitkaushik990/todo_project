const taskService = require("../Service/task_service");
const logger = require("../config/logger");

exports.createTask = async (req, res) => {
  logger.info("In creation of the task ");
  try {
    let loggedInUser = req.loggedInUser;
    const { title, description, priority, due_date, assignee, status } =
      req.body;
    const _id = await taskService.createTasks(
      loggedInUser._id,
      title,
      description,
      priority,
      due_date,
      assignee,
      status
    );
    res.status(201).send({ id: _id });
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ message: error.message });
  }
};

exports.getTask = async (req, res) => {
  logger.info("get task by id");
  try {
    let loggedInUser = req.loggedInUser;

    const tasks = await taskService.getTasks(loggedInUser._id);
    res.status(200).send(tasks);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  logger.info("in deletion of the task");
  try {
    let loggedInUser = req.loggedInUser;
    const _id = req.params;
    const done = await taskService.delTask(_id, loggedInUser._id);
    res.status(200).json(done);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getalltask = async (req, res) => {
  logger.info("Admin authorized to view all the task");
  try {
    let loggedInUser = req.loggedInUser;
    const tasks = await taskService.getalltask(loggedInUser._id);
    res.status(200).send(tasks);
  } catch (error) {
    logger.error("Failed to present all the tasks:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.editTask = async (req, res) => {
  logger.info("in editing the presnt task");
  try {
    let loggedInUser = req.loggedInUser;
    let taskid = req.params;
    const { title, description, priority, assignee } = req.body;
    const task = await taskService.editTask(
      loggedInUser._id,
      taskid,
      title,
      description,
      priority,
      assignee
    );
    res.status(201).send(task);
  } catch (error) {
    logger.error("Failed to modify the tasks:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.assignTask = async (req, res) => {
  logger.info("in assigning the task");
  try {
    const taskid = req.params.id;
    const user = req.loggedInUser;
    const { assigneeEmail } = req.body;
    const task = await taskService.getTask(taskid);
    if (
      user._id.toString() != task.created_by.toString() &&
      user._id.toString() != task.assignee.toString()
    ) {
      throw new Error("User not authorized to assign the task");
    }
    const result = await taskService.assignTask(taskid, assigneeEmail);
    res.status(200).send(result);
  } catch (error) {
    logger.error(" error in assigning task ", error);
    res.status(400).json({ error: error.message });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await taskService.getTask(id);
    const user = req.loggedInUser;

    const status = req.body.status;

    await taskService.changeStatus(id, status, user);
    res.status(200).json({
      message: "Task Status changed successfully",
    });
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: error.message,
    });
  }
};
