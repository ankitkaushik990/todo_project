const mongoose = require("mongoose");

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
  priyority: {
    type: String,
    validator: function (type) {
      const allowedType = ["easy", "medium", "high"];
      if (allowedType.includes(type)) {
        return;
      } else {
        throw new Error(`priyority can be only set as easy medium or High  `);
      }
    },
    message: "level can be set as easy medium or high ",
    trim: true,
    required: true,
  },
  due_date: {
    validUntil: Date,
  },
  assignee: {
    type: String,
  },
  cerated_on: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    validator: function (type) {
      const allowedType = ["progress", "done"];
      if (allowedType.includes(type)) {
        return;
      } else {
        throw new Error(`status can only be in - progress and done `);
      }
    },
    message:
      "type of status can only be marked as Progress and done , would you want it to mark done ? ",
  },
});

module.exports = mongoose.model("Todo", todoSchema);
