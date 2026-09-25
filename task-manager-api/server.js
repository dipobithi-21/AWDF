const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Task = require("./models/Task");

const app = express();
const PORT = 5000;

// ===============================
// MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// ===============================
// Middleware
// ===============================
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.url} - ${new Date().toISOString()}`
  );

  next();
});

// Content-Type validation
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    if (!req.is("application/json")) {
      return res.status(400).json({
        error: "Content-Type must be application/json"
      });
    }
  }

  next();
});

// ===============================
// Home Route
// ===============================
app.get("/", (req, res) => {
  res.status(200).send("Task Manager API is Running!");
});

// ===============================
// GET ALL TASKS
// ===============================
app.get("/tasks", async (req, res, next) => {
  try {
    const tasks = await Task.find();

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

// ===============================
// CREATE TASK
// ===============================
app.post("/tasks", async (req, res, next) => {
  try {
    const {
      title,
      description,
      completed,
      priority
    } = req.body;

    const newTask = await Task.create({
      title,
      description,
      completed,
      priority
    });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

// ===============================
// GET TASK BY ID
// ===============================
app.get("/tasks/:id", async (req, res, next) => {
  try {
    // Check whether ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: "Invalid task ID"
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// ===============================
// UPDATE TASK
// ===============================
app.put("/tasks/:id", async (req, res, next) => {
  try {
    // Check whether ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: "Invalid task ID"
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// ===============================
// DELETE TASK
// ===============================
app.delete("/tasks/:id", async (req, res, next) => {
  try {
    // Check whether ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: "Invalid task ID"
      });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    next(error);
  }
});

// ===============================
// ROUTE NOT FOUND
// ===============================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================
app.use((err, req, res, next) => {
  console.error(err);

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const details = {};

    for (const field in err.errors) {
      details[field] = err.errors[field].message;
    }

    return res.status(400).json({
      error: "Validation failed",
      details: details
    });
  }

  // Mongoose Cast Error
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Invalid task ID"
    });
  }

  // Other errors
  res.status(500).json({
    error: "Something went wrong"
  });
});

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});