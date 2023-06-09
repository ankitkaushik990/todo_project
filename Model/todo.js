const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("../Model/user");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  priority: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    lowercase: true,
    default: "todo",
  },
});

todoSchema.pre("save", function (next) {
  const allowedPriorities = ["easy", "medium", "high"];
  const allowedStatuses = ["inprogress", "done", "todo"];

  if (!allowedPriorities.includes(this.priority)) {
    throw new Error("Priority can only be set as 'easy', 'medium', or 'high'");
  }

  if (!allowedStatuses.includes(this.status)) {
    throw new Error("Status can only be set as 'inprogress','done'OR 'todo'");
  }

  next();
});

module.exports = mongoose.model("Todo", todoSchema);
