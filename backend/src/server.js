const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const channelRoutes = require("./routes/channelRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const activityRoutes = require("./routes/activityRoutes");
const taskRoutes = require("./routes/taskRoutes");
const fileRoutes = require("./routes/fileRoutes");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

/* SOCKET CONNECTION */

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  socket.on("joinChannel", (channelId) => {
    socket.join(channelId);
  });

  socket.on("sendMessage", (data) => {

    io.to(data.channelId).emit("receiveMessage", data);

  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

});

/* MIDDLEWARE */

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDB();

/* ROUTES */

app.use("/api/auth", authRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/channel", channelRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/file", fileRoutes);

/* TEST */

app.get("/", (req, res) => {
  res.send("API running successfully");
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});