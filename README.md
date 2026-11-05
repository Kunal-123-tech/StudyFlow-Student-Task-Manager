# StudyFlow-Student-Task-Manager

A full-stack student task management application built with React, Node.js and Express.

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
Tasks are stored in `server/tasks.json` and persist when the backend restarts.
