# Team Workspace Platform — Frontend

This is the React frontend for the Team Workspace Platform (MERN). It connects to the existing Node/Express backend and displays workspaces, channels, messages, tasks, files, notifications and activity in a modern dashboard UI.

---

## Quick Start

Prerequisites:
- Node.js (16+ recommended)
- npm
- Backend running and accessible (by default `http://localhost:5001`)

Install and run the dev server:

```bash
cd frontend
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
npm run preview   # preview the production build
```

---

## Default API base URL

API client: `src/api/api.js`

By default the frontend expects the backend API at:

```
http://localhost:5001/api
```

If your backend runs on a different host/port, edit `src/api/api.js` and update `baseURL` accordingly.

---

## Authentication

- Login/Register are in `src/pages/Login.jsx` and `src/pages/Register.jsx`.
- On successful login the backend returns a JWT and the frontend stores it via `AuthContext` in `localStorage` under the key `token`.
- Axios requests include the token automatically using an interceptor in `src/api/api.js`.

Important: logout removes the token and redirects to the login page.

---

## Key Features

- Header with navigation, theme toggle and logout (`src/components/Header.jsx`).
- Sidebar with Create Workspace form and responsive card grid of stored workspaces (`src/components/Sidebar.jsx`, `src/components/WorkspaceCard.jsx`).
- Main Dashboard that contains tabbed views (Messages, Tasks, Files, Notifications, Activity) (`src/pages/Dashboard.jsx`).
- Storage Gallery page with glassmorphism-style cards, skeleton loading, and a sync button (`src/pages/StorageGallery.jsx`, `src/components/StorageCard.jsx`, `src/components/StorageSkeleton.jsx`, `src/components/SyncButton.jsx`).
- Chat, Tasks, Files, Notifications panels wired to backend endpoints (`src/components/*Panel.jsx`).

---

## Project Structure (important files)

- `src/api/api.js` — Axios instance with `baseURL` and auth interceptor.
- `src/context/AuthContext.jsx` — Authentication provider and helper functions.
- `src/routes/AppRoutes.jsx` — React Router routes and `PrivateRoute` wrapper.
- `src/pages/` — Page-level components: `Login.jsx`, `Register.jsx`, `Dashboard.jsx`, `Profile.jsx`, `StorageGallery.jsx`, `Workspace.jsx`, `Channel.jsx`.
- `src/components/` — UI components: `Header.jsx`, `Sidebar.jsx`, `WorkspaceCard.jsx`, `ChannelCard.jsx`, `ChatPanel.jsx`, `TaskPanel.jsx`, `FileUploadPanel.jsx`, `NotificationPanel.jsx`, `ActivityFeed.jsx`, `StorageCard.jsx`, `StorageSkeleton.jsx`, `SyncButton.jsx`.
- `src/styles/theme.css` — Centralized styles and theme variables.

---

## Styling & Theming

- Global styles and design tokens live in `src/styles/theme.css`.

# Point-by-point Frontend Reference

Below is a concise, point-by-point reference you can paste into `frontend/README.md` or use as a quick guide when working on the frontend. It summarizes structure, positions, fonts, colors, and where to make common changes.

1) Layout regions (where they are):
	- Header: `src/components/Header.jsx` — top of the page, global nav.
	- Sidebar: `src/components/Sidebar.jsx` — left column. Contains Create Workspace form and the workspace card grid (cards appear below the form).
	- Main Content: page area (right side). Implemented per page (Dashboard, Workspace, Channel, StorageGallery).

2) Fonts & typography:
	- Poppins imported at the top of `src/styles/theme.css`.
	- Body font is configured in `theme.css`. Change the `@import` and `body { font-family: ... }` to replace fonts.

3) Color tokens (edit in `src/styles/theme.css` :root):
	- `--palette-1: #81A6C6` — highlight
	- `--palette-2: #F3E3D0` — light text
	- `--palette-3: #D2C4B4` — light surfaces
	- `--palette-4: #84B179` — accent (buttons)
	- `--palette-5: #213C50` — secondary background
	- `--palette-6: #574964` — deep accent
	- `--palette-7: #1B211A` — primary background
	- `--palette-8: #628141` — success / active
	- `--palette-9: #234C6A` — secondary card/bg

4) Card & grid control (where to change sizes):
	- `src/styles/theme.css` → `.workspace-cards-grid` (grid template, gap) and `.workspace-card` (card padding, radius, width).
	- To switch from compact 100px cards to standard 250px cards change `minmax(100px, 1fr)` → `minmax(250px, 1fr)`.

5) Storage Gallery specifics:
	- Page: `src/pages/StorageGallery.jsx` — fetches data, shows skeletons (`StorageSkeleton`) while loading, and `StorageCard` components in a grid.
	- Sync button: `src/components/SyncButton.jsx` — floating action to re-fetch data.

6) Auth & API:
	- Axios client: `src/api/api.js` — baseURL and interceptor that includes `Authorization: Bearer <token>`.
	- Auth provider: `src/context/AuthContext.jsx` — stores token and exposes `login()` / `logout()`.

7) Common quick edits:
	- Change API base: update `baseURL` in `src/api/api.js`.
	- Change colors: edit `:root` variables in `src/styles/theme.css`.
	- Increase card size: edit `.workspace-cards-grid` and `.workspace-card` in `theme.css`.
	- Toggle font: edit the `@import` and `body { font-family }` in `theme.css`.

8) Commands
	- `npm run dev` — start dev server
	- `npm run build` — production build
	- `npm run preview` — preview build

If you want, I can add small annotated screenshots and a one-page diagram mapping components to UI regions. Would you like that? 
- Workspace management
