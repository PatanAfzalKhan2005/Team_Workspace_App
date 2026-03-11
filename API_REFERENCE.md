# 📡 API Endpoints Reference

## Authentication Required
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 🏢 Workspace Endpoints

### Get All Workspaces
```http
GET /api/workspace
```
**Response**: Array of workspaces with owner info

### Create Workspace
```http
POST /api/workspace/create
Content-Type: application/json

{
  "name": "My Workspace"
}
```

---

## 📡 Channel Endpoints

### Get All Channels
```http
GET /api/channel/all
```
**Response**: Array of all user's channels with workspace info

### Get Channels by Workspace
```http
GET /api/channel/:workspaceId
```

### Create Channel
```http
POST /api/channel/create
Content-Type: application/json

{
  "name": "General",
  "workspaceId": "workspace_id_here"
}
```

---

## ✅ Task Endpoints

### Get All Tasks
```http
GET /api/task/all
```
**Response**: Array of all user's tasks with channel info

### Get Tasks by Channel
```http
GET /api/task/:channelId
```

### Create Task
```http
POST /api/task/create
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task Description",
  "channelId": "channel_id_here"
}
```

### Update Task Status
```http
PUT /api/task/:id
Content-Type: application/json

{
  "status": "todo" | "in-progress" | "done"
}
```

---

## 💬 Message Endpoints

### Get All Messages
```http
GET /api/message/all
```
**Response**: Last 100 messages with sender and channel info

### Get Messages by Channel
```http
GET /api/message/:channelId
```

### Send Message
```http
POST /api/message/send
Content-Type: application/json

{
  "content": "Hello World!",
  "channelId": "channel_id_here"
}
```

---

## 🔐 Auth Endpoints

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 📊 Response Formats

### Success Response
```json
{
  "message": "Success message",
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Error message"
}
```

---

## 🎯 Frontend Usage Example

```javascript
import API from "../api/api";

// Get all workspaces
const workspaces = await API.get("/workspace");

// Create workspace
await API.post("/workspace/create", { name: "New Workspace" });

// Get all tasks
const tasks = await API.get("/task/all");

// Update task status
await API.put(`/task/${taskId}`, { status: "done" });
```

---

## 🔄 Data Population

All endpoints automatically populate related data:
- Workspaces → owner (User)
- Channels → workspace, createdBy (User)
- Tasks → channel, createdBy (User)
- Messages → channel, sender (User)

---

## ⚡ Performance Tips

1. Use `/all` endpoints for dashboard/storage views
2. Use specific endpoints (by ID) for detail views
3. Batch requests with `Promise.all()` when possible
4. Data is sorted by `createdAt` (newest first)

---

**Base URL**: `http://localhost:5001/api`
**Default Port**: 5001 (configurable in .env)
