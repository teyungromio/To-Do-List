const mongoose = require("mongoose");
const Task = require("../models/Task");
const { asyncHandler } = require("../middleware/errorHandler");

function validateTaskId(id, res) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid task ID"
    });
    return false;
  }
  return true;
}

function normalizeDueDate(value) {
  if (value === undefined || value === null || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
}

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: tasks.length,
    tasks
  });
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Task title is required"
    });
  }

  if (title.trim().length > 100) {
    return res.status(400).json({
      success: false,
      message: "Task title cannot exceed 100 characters"
    });
  }

  const parsedDate = normalizeDueDate(dueDate);
  if (dueDate && parsedDate === undefined) {
    return res.status(400).json({
      success: false,
      message: "Invalid due date"
    });
  }

  const task = await Task.create({
    title: title.trim(),
    description: description?.trim() || "",
    dueDate: parsedDate,
    user: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task
  });
});

const updateTask = asyncHandler(async (req, res) => {
  if (!validateTaskId(req.params.id, res)) return;

  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const { title, description, dueDate, isCompleted } = req.body;

  if (title !== undefined) {
    if (!title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title cannot be empty"
      });
    }
    if (title.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: "Task title cannot exceed 100 characters"
      });
    }
    task.title = title.trim();
  }

  if (description !== undefined) {
    if (description.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 1000 characters"
      });
    }
    task.description = description.trim();
  }

  if (dueDate !== undefined) {
    const parsedDate = normalizeDueDate(dueDate);
    if (dueDate && parsedDate === undefined) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date"
      });
    }
    task.dueDate = parsedDate;
  }

  if (isCompleted !== undefined) {
    if (typeof isCompleted !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isCompleted must be a boolean"
      });
    }
    task.isCompleted = isCompleted;
  }

  await task.save();

  res.json({
    success: true,
    message: "Task updated successfully",
    task
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  if (!validateTaskId(req.params.id, res)) return;

  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  await task.deleteOne();

  res.json({
    success: true,
    message: "Task deleted successfully"
  });
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
