# Student Task Manager

A beginner-friendly full-stack project built with HTML, CSS, JavaScript, React, Node.js and Express.

## Requirements
- Node.js (LTS)
- npm

## Run the project

Open a terminal in this project folder and run:

```bash
npm install
npm run install:all
npm run dev
```

Open http://localhost:5173 in your browser.

The React frontend runs on port 5173. The Express API runs on port 5000.

## API routes
- `GET /api/tasks` — list tasks
- `POST /api/tasks` — create a task
- `PUT /api/tasks/:id` — update a task
- `DELETE /api/tasks/:id` — delete a task

## Note
Tasks are stored in server memory for learning purposes. They reset when the backend restarts. A future improvement is to add MongoDB.
