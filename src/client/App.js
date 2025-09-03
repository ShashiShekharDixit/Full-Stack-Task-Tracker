// App.js
import React, { useState, useEffect } from "react";
import "./app.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Fetch tasks from server
  useEffect(() => {
    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Add a task
  const addTask = async () => {
    if (!newTask.trim()) return;

    const res = await fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTask }),
    });

    const createdTask = await res.json();
    setTasks([...tasks, createdTask]);
    setNewTask("");
  };

  // Toggle task
  const toggleTask = async (id) => {
    const res = await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "PUT",
    });

    const data = await res.json();
    setTasks(data.tasks);
  };

  // Delete task
  const deleteTask = async (id) => {
    const res = await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    setTasks(data.tasks);
  };

  return (
    <div className="app">
      <h1>✅ Task Tracker</h1>

      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks yet. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className={task.done ? "done" : ""}>
              <span onClick={() => toggleTask(task.id)}>{task.text}</span>
              <button onClick={() => deleteTask(task.id)}>❌</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
