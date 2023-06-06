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
  console.log("In creation of the task  ");
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
  console.log(" we get all task created by specified person ");
  try {
    const tasks = await Todo.find({ created_by: userId });
    if (!tasks) {
      throw new Error(`No task created by the User `);
    }
    return tasks;
  } catch (error) {
    console.log({ message: error.message });
  }
};

// here _id is the task id to delete and created by is the id who created that task

exports.delTask = async (_id, userId) => {
  console.log("in service to delete task");
  console.log(_id);
  try {
    // Find the task by ID
    const task = await Todo.findById(_id);
    // console.log(task);

    if (!task) {
      return "Task not found.";
    }

    if (!task.created_by || task.created_by.toString() !== userId.toString()) {
      return "Unauthorized to delete the task.";
    }

    // Delete the task
    await Todo.findOneAndDelete({ _id });
    return "Task deleted successfully.";
  } catch (error) {
    console.log({ message: error.message });
    throw new Error("Error while deleting the task.");
  }
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
    console.log({ message: error.message });
    throw new Error("Error while retrieving tasks.");
  }
};
