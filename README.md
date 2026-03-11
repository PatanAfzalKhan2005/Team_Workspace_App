# Team Workspace App

A full-stack collaborative workspace application — chat, channels, file storage, tasks, notifications, and activity feed.

## Contents
- Overview
- Features
- Tech stack
- Repo structure (key files)
- Backend: setup, env vars, routes, scripts
- Frontend: setup, scripts, components, pages, auth flow
- UI Theme & Colors (exact tokens)
- Running locally
- Testing & Deployment
- Contribution
- License

## Overview
This repository contains a Node/Express backend (MongoDB) and a React + Vite frontend. It supports user registration/login (JWT), workspaces and channels, real-time messaging (Socket.IO), file uploads (multer), notifications, tasks, and activity tracking.

## Features
- User authentication (register / login) with JWT
- Workspaces and channels
- Real-time chat with Socket.IO
- File upload and storage (local `uploads/` folder)
- Notifications and activity feed
- Task board and basic task management
- Dark/light theming tokens in CSS

## Tech Stack
- Backend: Node.js, Express, MongoDB (mongoose), Socket.IO
- Frontend: React, Vite, React Router, Zustand (state), Axios
- Auth: JSON Web Tokens (JWT)
- File uploads: multer

## Repo structure (key files)
Root:
- `README.md` (this file)
- `API_REFERENCE.md`, `QUICK_START.md`, `TESTING_GUIDE.md`, `UI_DESIGN_GUIDE.md`

Backend: `backend/`
- `package.json` — scripts: `start`, `dev` (`nodemon`)
- `src/server.js` — main server, Socket.IO setup, route registration
- `src/config/db.js` — MongoDB connection (uses `MONGO_URI` env)
- `src/controllers/` — controllers for auth, channels, messages, files, tasks, notifications, activity, workspace
- `src/routes/` — route definitions: `authRoutes.js`, `workspaceRoutes.js`, `channelRoutes.js`, `messageRoutes.js`, `notificationRoutes.js`, `activityRoutes.js`, `taskRoutes.js`, `fileRoutes.js`
- `src/middleware/authMiddleware.js` — auth middleware (protect routes)
- `src/models/` — Mongoose models: `User.js`, `Workspace.js`, `Channel.js`, `Message.js`, `Notification.js`, `Task.js`, `File.js`
- `src/services/fileUploadService.js` — multer disk storage (uploads to `uploads/`)
- `uploads/` — static folder served at `/uploads`

Frontend: `frontend/`
- `package.json` — scripts: `dev`, `build`, `preview`
- `index.html`, `vite.config.js`
- `src/main.jsx`, `src/App.jsx`, `src/api/api.js` (Axios instance)
- `src/context/AuthContext.jsx` — authentication context, stores JWT in `localStorage`
- `src/hooks/useSocket.js` — Socket.IO client hook
- `src/components/` — UI components (see list below)
- `src/pages/` — page-level views: `Login.jsx`, `Register.jsx`, `Dashboard.jsx`, `Channel.jsx`, `Workspace.jsx`, `Profile.jsx`, `StorageGallery.jsx`
- `src/styles/theme.css` — design tokens and color palette (exact values in section below)

Frontend components (not exhaustive, main files):
- `ActivityFeed.jsx`, `Channel.jsx`, `ChannelCard.jsx`, `ChannelPanel.jsx`, `Chat.jsx`, `ChatPanel.jsx`, `ChatWindow.jsx`,
- `FilePanel.jsx`, `FileUpload.jsx`, `FileUploader.jsx`, `FileUploadPanel.jsx`,
- `Header.jsx`, `Navbar.jsx`, `NotificationBell.jsx`, `NotificationPanel.jsx`, `Notifications.jsx`,
- `Sidebar.jsx`, `StorageCard.jsx`, `StorageSkeleton.jsx`, `SyncButton.jsx`,
- `TaskBoard.jsx`, `TaskPanel.jsx`, `Tasks.jsx`,
- `Upload.jsx`, `Workspace.jsx`, `WorkspaceCard.jsx`, `WorkspacePanel.jsx`

## Backend — setup & env vars
Required environment variables (create `.env` in `backend/`):
- `MONGO_URI` — MongoDB connection string (required)
- `JWT_SECRET` — secret used to sign JWT tokens (required)
- `PORT` — optional (defaults to `5001`)

Install and run:

```bash
# from repository root
cd backend
npm install
npm run dev   # development (nodemon)
# or
npm start     # run once
```

Server exposes API base at `http://localhost:5001` (default). Key mounted routes:
- `POST /api/auth/register` — register new user (body: `{ name, email, password }`)
- `POST /api/auth/login` — login (body: `{ email, password }`) → returns `{ token }`
- `GET/POST/PUT/DELETE` endpoints for workspaces: `/api/workspace` (see `workspaceRoutes.js`)
- Channels: `/api/channel`
- Messages: `/api/message` (real-time complements Socket.IO)
- Notifications: `/api/notifications`
- Activity: `/api/activity`
- Tasks: `/api/task`
- Files: `/api/file` (file uploads handled using multipart/form-data; service writes to `uploads/`)

Authentication: protected routes expect a Bearer JWT in `Authorization` header. The backend uses `process.env.JWT_SECRET` to sign and verify tokens.

Socket.IO: server configured in `src/server.js`. Events include `joinChannel`, `sendMessage` and server emits `receiveMessage` to channel rooms.

## Frontend — setup & scripts
Install and run:

```bash
cd frontend
npm install
npm run dev   # starts Vite dev server (typically at http://localhost:5173)
npm run build # builds production assets
npm run preview # preview build
```

Frontend configuration:
- `src/api/api.js` — Axios base instance (useful to set `Authorization: Bearer <token>` header)
- `src/context/AuthContext.jsx` — stores `token` in `localStorage` under key `token`, and exposes `login(newToken)` and `logout()` functions
- `src/hooks/useSocket.js` — connects client to server Socket.IO endpoint; typically uses the backend URL

Auth flow (Login / Register):
- `Register.jsx` posts to `POST /api/auth/register` with `{ name, email, password }`. On success, shows user and prompts login (implementation may auto-login depending on UI).
- `Login.jsx` posts to `POST /api/auth/login` with `{ email, password }`. On success, receives `{ token }` and calls `login(token)` from `AuthContext` which stores the token in `localStorage`.
- Once logged in, frontend attaches `Authorization: Bearer <token>` to protected API requests via Axios or context middleware.

UI interaction notes:
- Workspace selection loads channels, messages, and wire up Socket.IO `joinChannel` to receive real-time messages.
- File uploads use `<input type="file">` and submit as multipart/form-data to `/api/file`.

## UI Theme & Colors (exact tokens)
Colors are defined in `src/styles/theme.css` using CSS variables. Exact values:

Palette tokens:
- `--palette-1`: #81A6C6
- `--palette-2`: #F3E3D0
- `--palette-3`: #D2C4B4
- `--palette-4`: #84B179
- `--palette-5`: #213C50
- `--palette-6`: #574964
- `--palette-7`: #1B211A
- `--palette-8`: #628141
- `--palette-9`: #234C6A

Semantic tokens:
- `--primary-bg`: var(--palette-7) → #1B211A
- `--primary-text`: var(--palette-2) → #F3E3D0
- `--accent`: var(--palette-4) → #84B179
- `--secondary-bg`: var(--palette-9) → #234C6A
- `--highlight`: var(--palette-1) → #81A6C6
- `--light-bg`: var(--palette-3) → #D2C4B4
- `--card-radius`: 12px

Other gradients and UI accents appear in `theme.css` (e.g., `.btn-gradient`, `.header` gradient, `.main-content` background).

Typography:
- Uses Google Font `Poppins` (imported) and falls back to system fonts. Body uses `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif` as primary fallback.

Dark mode:
- `body.dark-mode` switches backgrounds and text to `--primary-bg` and `--primary-text`.

## API Reference (quick)
- `POST /api/auth/register` — Register (name, email, password)
- `POST /api/auth/login` — Login (email, password) → returns JWT
- `GET /api/workspace` — Workspaces (list/create/get by id)
- `GET /api/channel` — Channels (list/create)
- `GET/POST /api/message` — Messages (create/list) — also handled via Socket.IO for real-time
- `POST /api/file` — Upload file (multipart/form-data); files saved to `uploads/` and served statically at `/uploads/<filename>`
- `GET /api/notifications` — Notifications
- `GET /api/activity` — Activity feed
- `GET/POST /api/task` — Tasks

(See route files in `backend/src/routes/` for exact parameters and payloads.)

## Running locally — quick steps
1. Start backend:

```bash
cd backend
npm install
# set environment variables in backend/.env
# example .env
# MONGO_URI="your_mongo_uri"
# JWT_SECRET="a_strong_secret"
# PORT=5001
npm run dev
```

2. Start frontend:

```bash
cd frontend
npm install
npm run dev
```

3. Open frontend (Vite): `http://localhost:5173` (or as printed by Vite). Backend runs on `http://localhost:5001` by default.

4. Register a user via the Register page or via `POST /api/auth/register`. Then login to receive a token saved to `localStorage` under key `token`.

## Testing & Deployment
- No automated tests included in repo currently. See `TESTING_GUIDE.md` for any project-specific notes.
- For production, build frontend with `npm run build` in `frontend/` and serve static assets behind a web server or CDN.
- Backend can be deployed to Node hosts (Heroku, Render, DigitalOcean). Ensure `MONGO_URI` and `JWT_SECRET` are provided as environment variables in production.
- Socket.IO should be configured to use the correct production origin. Consider enabling secure (wss) with HTTPS and proxied servers.

## Contribution
- Follow code style in existing files.
- Use `npm run dev` for backend and frontend during development.
- Open pull requests against the repository and include a concise description of changes.

## Notes & Next Steps
- Add unit/integration tests for critical backend routes and React components.
- Consider storing uploaded files in external object storage (S3) for scalability.
- Add role-based access control for workspace membership and permissions.

---
If you want, I can also:
- Generate a compact `API_REFERENCE.md` with each endpoint's input/output shapes.
- Add a `.env.example` file with required env variables.
- Add CI scripts or Dockerfiles for local reproducible development.

#   T e a m _ W o r k s p a c e _ A p p  
 