import React, { useState, useEffect } from "react";
import "./app.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"; // ✅ recharts for graph

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a task
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
    setNewTask("");
  };

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Progress calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.done).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Data for Pie Chart
  const chartData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending", value: totalTasks - completedTasks },
  ];
  const COLORS = ["#4caf50", "#f44336"];

  return (
    <div className="app">
      <h1>✅ Task Tracker with Progress</h1>

      {/* Input Section */}
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
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

      {/* Progress Bar */}
      <div className="progress-container">
        <p>
          Progress: {completedTasks}/{totalTasks} tasks ({progress}%)
        </p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Graph */}
      <div className="chart-container">
        <h2>📊 Work Progress</h2>
        <PieChart width={300} height={250}>
          <Pie
            data={chartData}
            cx={150}
            cy={120}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
