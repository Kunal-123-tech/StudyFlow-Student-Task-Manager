
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const app = express();
const PORT = 5000;

// Find the current folder
const __dirname = path.dirname(
    fileURLToPath(import.meta.url)
);

// JSON database file
const dataFile = path.join(__dirname, "tasks.json");

// Middleware
app.use(cors());
app.use(express.json());

// Read tasks from JSON file
function readTasks() {

    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, "[]");
    }

    return JSON.parse(
        fs.readFileSync(dataFile, "utf8")
    );
}

// Save tasks in JSON file
function saveTasks(tasks) {

    fs.writeFileSync(
        dataFile,
        JSON.stringify(tasks, null, 2)
    );
}

// GET: Get all tasks
app.get("/api/tasks", (req, res) => {

    const tasks = readTasks();

    res.json(tasks);
});

// POST: Add a new task
app.post("/api/tasks", (req, res) => {

    const {
        title,
        subject = "",
        dueDate = "",
        priority = "Medium"
    } = req.body;

    if (!title || !title.trim()) {

        return res.status(400).json({
            message: "Task title is required."
        });

    }

    const tasks = readTasks();

    const task = {

        id: randomUUID(),

        title: title.trim(),

        subject,

        dueDate,

        priority,

        completed: false,

        createdAt: new Date().toISOString()

    };

    tasks.unshift(task);

    saveTasks(tasks);

    res.status(201).json(task);

});

// PUT: Update a task
app.put("/api/tasks/:id", (req, res) => {

    const tasks = readTasks();

    const index = tasks.findIndex(
        task => task.id === req.params.id
    );

    if (index === -1) {

        return res.status(404).json({
            message: "Task not found."
        });

    }

    tasks[index] = {
        ...tasks[index],
        ...req.body,
        id: tasks[index].id
    };

    saveTasks(tasks);

    res.json(tasks[index]);

});

// DELETE: Delete a task
app.delete("/api/tasks/:id", (req, res) => {

    const tasks = readTasks();

    const updatedTasks = tasks.filter(
        task => task.id !== req.params.id
    );

    if (updatedTasks.length === tasks.length) {

        return res.status(404).json({
            message: "Task not found."
        });

    }

    saveTasks(updatedTasks);

    res.json({
        message: "Task deleted successfully."
    });

});

// Start server
app.listen(PORT, () => {

    console.log(
        `StudyFlow API running at http://localhost:${PORT}`
    );

});
