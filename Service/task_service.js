const { error } = require("console");
const todo = require("../Model/todo");
const Todo = require("../Model/todo");

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

exports.getTasks = async (created_by) => {
  console.log(" we get all task created by specified person ");
  try {
    const tasks = await Todo.find({ created_by });
    return tasks;
  } catch (error) {
    console.log({ message: error.message });
  }
};

// here _id is the task id to delete and created by is the id who created that task

exports.delTask = async (_id, created_by) => {
  console.log("in service to delete task");
  console.log(_id);
  try {
    // Find the task by ID
    const task = await Todo.findById(_id);
    // console.log(task);

    if (!task) {
      return "Task not found.";
    }

    if (task.created_by !== created_by) {
      return "Unauthorized to delete the task.";
    }

    // Delete the task
    const result = await Todo.deleteOne({ _id });
    return "Task deleted successfully.";
  } catch (error) {
    console.log({ message: error.message });
    throw new Error("Error while deleting the task.");
  }
};
