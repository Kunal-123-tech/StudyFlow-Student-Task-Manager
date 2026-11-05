import React, { useEffect, useMemo, useState } from "react";

const API = "http://localhost:5000/api/tasks";

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    // Fetch all tasks from backend
    async function loadTasks() {
        try {
            const response = await fetch(API);

            if (!response.ok) {
                throw new Error("Could not load tasks");
            }

            const data = await response.json();
            setTasks(data);
            setError("");
        } catch (err) {
            setError(
                "Cannot connect to backend. Start the Node.js server."
            );
        }
    }

    useEffect(() => {
        loadTasks();
    }, []);

    // Add new task
    async function addTask(event) {
        event.preventDefault();

        if (!title.trim()) return;

        try {
            const response = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    subject,
                    dueDate,
                    priority
                })
            });

            if (!response.ok) {
                throw new Error("Task could not be added");
            }

            const newTask = await response.json();

            setTasks(current => [newTask, ...current]);

            setTitle("");
            setSubject("");
            setDueDate("");
            setPriority("Medium");
            setError("");
        } catch (err) {
            setError("Unable to add task. Check the backend.");
        }
    }

    // Complete or uncomplete task
    async function toggleTask(task) {
        try {
            const response = await fetch(
                `${API}/${task.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        completed: !task.completed
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Update failed");
            }

            const updated = await response.json();

            setTasks(current =>
                current.map(item =>
                    item.id === updated.id ? updated : item
                )
            );
        } catch {
            setError("Unable to update task.");
        }
    }

    // Delete task
    async function deleteTask(id) {
        try {
            const response = await fetch(
                `${API}/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Delete failed");
            }

            setTasks(current =>
                current.filter(task => task.id !== id)
            );
        } catch {
            setError("Unable to delete task.");
        }
    }

    // Search and filter
    const visibleTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesFilter =
                filter === "All" ||
                (filter === "Pending" && !task.completed) ||
                (filter === "Completed" && task.completed);

            const matchesSearch =
                `${task.title} ${task.subject}`
                    .toLowerCase()
                    .includes(search.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [tasks, filter, search]);

    // Dashboard calculations
    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = tasks.length - completed;

    const progress = tasks.length
        ? Math.round((completed / tasks.length) * 100)
        : 0;

    return (
        <div className="app-shell">

            {/* Sidebar */}
            <aside className="sidebar">

                <div className="brand">
                    <span className="brand-icon">S</span>
                    <span>StudyFlow</span>
                </div>

                <p className="side-label">WORKSPACE</p>

                <div className="nav-item active">
                    ▦ <span>My dashboard</span>
                </div>

                <div className="nav-item">
                    ✓ <span>My tasks</span>
                </div>

                <div className="side-note">
                    <div className="note-icon">✦</div>
                    <strong>Stay focused!</strong>
                    <p>
                        Small steps every day lead to big results.
                    </p>
                </div>

                <div className="sidebar-footer">
                    Student productivity space
                </div>

            </aside>

            {/* Main dashboard */}
            <main className="main-content">

                <header className="topbar">
                    <div>
                        <p className="eyebrow">
                            YOUR PERSONAL WORKSPACE
                        </p>
                        <h1>My dashboard</h1>
                    </div>

                    <div className="avatar">S</div>
                </header>

                {/* Welcome section */}
                <section className="welcome">

                    <div>
                        <p className="eyebrow light">
                            LET'S MAKE TODAY COUNT
                        </p>

                        <h2>Welcome back, Student! 👋</h2>

                        <p>
                            Organise your study plan and keep moving forward.
                        </p>
                    </div>

                    <div className="welcome-mark">✦</div>

                </section>

                {/* Statistics */}
                <section className="stats">

                    <article className="stat-card">
                        <div className="stat-top">
                            <span>Total tasks</span>
                            <span className="stat-icon purple">▤</span>
                        </div>

                        <strong>{tasks.length}</strong>
                        <small>All your study goals</small>
                    </article>

                    <article className="stat-card">
                        <div className="stat-top">
                            <span>Pending</span>
                            <span className="stat-icon orange">◷</span>
                        </div>

                        <strong>{pending}</strong>
                        <small>Waiting to be completed</small>
                    </article>

                    <article className="stat-card">
                        <div className="stat-top">
                            <span>Completed</span>
                            <span className="stat-icon green">✓</span>
                        </div>

                        <strong>{completed}</strong>
                        <small>Great work, keep going!</small>
                    </article>

                </section>

                {/* Content section */}
                <section className="content-grid">

                    {/* Task list */}
                    <div className="panel task-panel">

                        <div className="panel-heading">
                            <div>
                                <h3>My tasks</h3>
                                <p>Manage your study activities</p>
                            </div>

                            <span className="task-count">
                                {visibleTasks.length} tasks
                            </span>
                        </div>

                        {/* Search and filter */}
                        <div className="toolbar">

                            <input
                                className="search"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search tasks..."
                            />

                            <select
                                value={filter}
                                onChange={e => setFilter(e.target.value)}
                            >
                                <option>All</option>
                                <option>Pending</option>
                                <option>Completed</option>
                            </select>

                        </div>

                        {error && (
                            <div className="error">{error}</div>
                        )}

                        <div className="task-list">

                            {visibleTasks.length === 0 ? (

                                <div className="empty">
                                    <span>✧</span>
                                    <strong>No tasks found</strong>
                                    <p>
                                        Add a task to start organising your day.
                                    </p>
                                </div>

                            ) : (

                                visibleTasks.map(task => (

                                    <article
                                        className={`task-row ${
                                            task.completed ? "is-done" : ""
                                        }`}
                                        key={task.id}
                                    >

                                        <button
                                            className={`check ${
                                                task.completed ? "checked" : ""
                                            }`}
                                            onClick={() => toggleTask(task)}
                                        >
                                            {task.completed ? "✓" : ""}
                                        </button>

                                        <div className="task-info">

                                            <strong>{task.title}</strong>

                                            <p>
                                                {task.subject || "General"}

                                                {task.dueDate &&
                                                    ` · Due ${task.dueDate}`}
                                            </p>

                                        </div>

                                        <span
                                            className={`priority ${task.priority.toLowerCase()}`}
                                        >
                                            {task.priority}
                                        </span>

                                        <button
                                            className="delete"
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            ×
                                        </button>

                                    </article>

                                ))

                            )}

                        </div>

                    </div>

                    {/* Right column */}
                    <div className="right-column">

                        {/* Add task form */}
                        <div className="panel add-panel">

                            <div className="panel-heading">
                                <div>
                                    <h3>Add a task</h3>
                                    <p>What do you need to do?</p>
                                </div>

                                <span className="plus">＋</span>
                            </div>

                            <form onSubmit={addTask}>

                                <label>
                                    Task title

                                    <input
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder="e.g. Complete React assignment"
                                        required
                                    />
                                </label>

                                <label>
                                    Subject / category

                                    <input
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        placeholder="e.g. Web Development"
                                    />
                                </label>

                                <label>
                                    Due date

                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={e => setDueDate(e.target.value)}
                                    />
                                </label>

                                <label>
                                    Priority

                                    <select
                                        value={priority}
                                        onChange={e => setPriority(e.target.value)}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>
                                </label>

                                <button className="submit-btn" type="submit">
                                    ＋ Add task
                                </button>

                            </form>

                        </div>

                        {/* Progress */}
                        <div className="panel progress-panel">

                            <div className="panel-heading">
                                <div>
                                    <h3>Your progress</h3>
                                    <p>Completion overview</p>
                                </div>
                            </div>

                            <div className="progress-number">
                                {progress}<span>%</span>
                            </div>

                            <div className="progress-track">
                                <div
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <p className="progress-caption">
                                {completed} of {tasks.length} tasks completed
                            </p>

                        </div>

                    </div>

                </section>

                <footer>
                    Made for better study habits · StudyFlow
                </footer>

            </main>

        </div>
    );
}
