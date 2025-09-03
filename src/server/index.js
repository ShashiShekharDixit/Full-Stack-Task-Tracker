// server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing JSON bodies

// Temporary in-memory "database"
let tasks = [];

// Routes
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "Task text is required" });
  }

  const newTask = { id: Date.now(), text, done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.map((task) =>
    task.id === Number(id) ? { ...task, done: !task.done } : task
  );
  res.json({ success: true, tasks });
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== Number(id));
  res.json({ success: true, tasks });
});

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:8080`)
);
