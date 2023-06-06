const Todo = require("../Model/todo");
const User = require("../Model/user");

exports.createTasks = async (
  userId,
  title,
  description,
  priority,
  due_date,
  assignee,
  status
) => {
  // console.log("In creation of the task  ");
  const todo = new Todo({
    title,
    description,
    priority,
    due_date,
    assignee,
    status,
    created_by: userId,
  });
  await todo.save();
  // the task id is retured to the user
  return todo._id;
};

exports.getTasks = async (userId) => {
  // console.log(" we get all task created by specified person ");

  const tasks = await Todo.find({ created_by: userId });
  if (tasks.length === 0) {
    throw new Error(`No task created by the User `);
  }
  return tasks;
};

// here _id is the task id to delete and created by is the id who created that task

exports.delTask = async (_id, userId) => {
  // console.log("in service to delete task");
  console.log(_id);
  // Find the task by ID
  const task = await Todo.findById(_id);
  // console.log(task);

  if (!task) {
    throw new Error("Task not found.");
  }

  if (!task.created_by || task.created_by.toString() !== userId.toString()) {
    throw new Error("Unauthorized to delete the task.");
  }

  // Delete the task
  await Todo.findOneAndDelete({ _id });
  return "Task deleted successfully.";
};

exports.getalltask = async (_id) => {
  try {
    const user = await User.findById(_id);
    if (!user) {
      return `No such user found for this id.`;
    }
    if (user.role === "admin") {
      // Code to retrieve and return all tasks
      const tasks = await Todo.find();
      return tasks;
    } else {
      return `You are not authorized to access all tasks.`;
    }
  } catch (error) {
    // console.log({ message: error.message });
    throw new Error("Error while retrieving tasks.");
  }
};

exports.editTask = async (
  userId,
  taskid,
  title,
  description,
  priority,
  assignee,
  status
) => {
  try {
    // Find the task by ID
    const task = await Todo.findById(taskid);
    // console.log(task);

    if (!task) {
      return "NO such task found.";
    }

    if (!task.created_by || task.created_by.toString() !== userId.toString()) {
      return "Unauthorized to edit  the task.";
    }
    task.title = title;
    task.description = description;
    task.priority = priority;
    task.assignee = assignee;
    task.status = status;

    await task.save();
    return task._id;
  } catch (error) {
    // console.log({ message: error.message });
    throw new Error(error);
  }
};

exports.assignTask = async (taskid, assigneeEmail) => {
  const task = await Todo.findById(taskid);
  if (!task) throw new Error("Task not found");
  const assignee = await User.findOne({ email: assigneeEmail });

  if (!assignee) throw new Error("USer  not found");
  const newTask = await Todo.findOneAndUpdate(
    { _id: taskid },
    { assignee: assignee._id },
    { new: true }
  );
  newTask.save();
  return newTask;
};

exports.getTask = async (id) => {
  const task = await Todo.findById(id);
  if (!task) throw new Error("Task not found");
  return task;
};
