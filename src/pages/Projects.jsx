import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import Toast from "../components/Toast";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../api";

function Projects() {
  // =========================
  // Task states
  // =========================
  const [tasks, setTasks] = useState([]);

  // =========================
  // Loading and error states
  // =========================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Create task states
  // =========================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // =========================
  // Edit task states
  // =========================
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);

  // =========================
  // Toast notification state
  // =========================
  const [toast, setToast] = useState({
    message: "",
    type: "",
  });

  // =========================
  // Fetch tasks
  // =========================
  const fetchTasks = () => {
    setLoading(true);
    setError("");

    getTasks()
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        setError(err.message);

        setToast({
          message: "Failed to load tasks.",
          type: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // =========================
  // Load tasks when page opens
  // =========================
  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // Create Task
  // =========================
  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // Temporary task for optimistic UI
    const temporaryTask = {
      _id: `temp-${Date.now()}`,
      title: title,
      description: description,
      completed: false,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    // Show task immediately
    setTasks((previousTasks) => [
      ...previousTasks,
      temporaryTask,
    ]);

    // Data sent to backend
    const newTask = {
      title: title,
      description: description,
      completed: false,
    };

    // Clear form immediately
    setTitle("");
    setDescription("");

    // Send task to backend
    createTask(newTask)
      .then((createdTask) => {
        // Replace temporary task with real database task
        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task._id === temporaryTask._id
              ? createdTask
              : task
          )
        );

        // Success notification
        setToast({
          message: "Task created successfully!",
          type: "success",
        });
      })
      .catch((err) => {
        // Remove temporary task if request fails
        setTasks((previousTasks) =>
          previousTasks.filter(
            (task) => task._id !== temporaryTask._id
          )
        );

        // Error notification
        setToast({
          message: "Failed to create task.",
          type: "error",
        });

        setError(err.message);
      });
  };

  // =========================
  // Delete Task
  // =========================
  const handleDelete = (id) => {
    // Confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setError("");

    deleteTask(id)
      .then(() => {
        // Remove task from UI
        setTasks((previousTasks) =>
          previousTasks.filter(
            (task) => task._id !== id
          )
        );

        // Success notification
        setToast({
          message: "Task deleted successfully!",
          type: "success",
        });
      })
      .catch((err) => {
        // Error notification
        setToast({
          message: "Failed to delete task.",
          type: "error",
        });

        setError(err.message);
      });
  };

  // =========================
  // Start Editing
  // =========================
  const startEditing = (task) => {
    setEditingId(task._id);

    setEditTitle(task.title);

    setEditDescription(
      task.description || ""
    );

    setEditCompleted(task.completed);
  };

  // =========================
  // Update Task
  // =========================
  const handleUpdate = (e) => {
    e.preventDefault();

    setError("");

    const updatedTask = {
      title: editTitle,
      description: editDescription,
      completed: editCompleted,
    };

    updateTask(editingId, updatedTask)
      .then((updatedData) => {
        // Update task in UI
        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task._id === editingId
              ? {
                  ...task,
                  ...updatedData,
                }
              : task
          )
        );

        // Exit edit mode
        setEditingId(null);

        // Success notification
        setToast({
          message: "Task updated successfully!",
          type: "success",
        });
      })
      .catch((err) => {
        // Error notification
        setToast({
          message: "Failed to update task.",
          type: "error",
        });

        setError(err.message);
      });
  };

  // =========================
  // Loading screen
  // =========================
  if (loading) {
    return <Spinner />;
  }

  // =========================
  // Error screen
  // =========================
  if (error && tasks.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchTasks}
      />
    );
  }

  // =========================
  // Main UI
  // =========================
  return (
    <div className="container">

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
      />

      <h2>My Tasks</h2>

      {/* =========================
          CREATE TASK FORM
          ========================= */}
      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
        />

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          required
        />

        <button type="submit">
          Add Task
        </button>

      </form>

      {/* =========================
          TASK LIST
          ========================= */}
      <div className="project-grid">

        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          tasks.map((task) => (

            <div
              className="project-card"
              key={task._id}
            >

              {/* =========================
                  EDIT MODE
                  ========================= */}
              {editingId === task._id ? (

                <form onSubmit={handleUpdate}>

                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) =>
                      setEditTitle(e.target.value)
                    }
                    placeholder="Task title"
                    required
                  />

                  <textarea
                    value={editDescription}
                    onChange={(e) =>
                      setEditDescription(
                        e.target.value
                      )
                    }
                    placeholder="Task description"
                    required
                  />

                  <label>

                    <input
                      type="checkbox"
                      checked={editCompleted}
                      onChange={(e) =>
                        setEditCompleted(
                          e.target.checked
                        )
                      }
                    />

                    Completed

                  </label>

                  <br />

                  <button type="submit">
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingId(null)
                    }
                  >
                    Cancel
                  </button>

                </form>

              ) : (

                /* =========================
                   VIEW MODE
                   ========================= */
                <>
                  <h3>{task.title}</h3>

                  <p>
                    {task.description}
                  </p>

                  <p>
                    Status:{" "}
                    {task.completed
                      ? "Completed"
                      : "Pending"}
                  </p>

                  <p>
                    Created:{" "}
                    {task.createdAt
                      ? new Date(
                          task.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>

                  {/* Optimistic task indicator */}
                  {task.optimistic && (
                    <p>
                      Saving...
                    </p>
                  )}

                  <button
                    onClick={() =>
                      startEditing(task)
                    }
                    disabled={task.optimistic}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(task._id)
                    }
                    disabled={task.optimistic}
                  >
                    Delete
                  </button>

                </>

              )}

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default Projects;