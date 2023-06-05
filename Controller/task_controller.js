const taskService = require("../Service/task_service");

exports.createTask = async (req, res) => {
  console.log("In creation of the task ");
  try {
    const { userId, title, description, priority, due_date, assignee, status } =
      req.body;
    const _id = await taskService.createTasks(
      userId,
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
  console.log("get task by id");
  try {
    const { created_by } = req.body;

    const tasks = await taskService.getTasks(created_by);
    res.status(200).send(tasks);
  } catch (error) {
    res.status(400).json({ error: "Failed to get tasks" });
  }
};

exports.deleteTask = async (req, res) => {
  console.log("in deletion of the task");
  try {
    const { created_by } = req.body;
    const { _id } = req.params;
    await taskService.delTask(_id, created_by);
    res.status(200).send("deleted successfully ");
  } catch (error) {
    res.status(400).json({ error: "Failed to delete tasks" });
  }
};

exports.getalltask = async (req, res) => {
  console.log("Admin authorized to view all the task");
  try {
    const { _id } = req.params;
    const tasks = await taskService.getalltask(_id);
    res.status(200).send(tasks);
  } catch (error) {
    console.error("Failed to present all the tasks:", error);
    res.status(400).json({ error: "Failed to present all the tasks" });
  }
};
