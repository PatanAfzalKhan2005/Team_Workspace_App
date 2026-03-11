import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import TasksPage from "../pages/TasksPage";
import WorkspacesPage from "../pages/WorkspacesPage";
import ChannelsPage from "../pages/ChannelsPage";
import MessagesPage from "../pages/MessagesPage";
import FilesPage from "../pages/FilesPage";
import BackendStorage from "../pages/BackendStorage";
import BackendStorageDetails from "../pages/BackendStorageDetails";

function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/" />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/workspaces" element={<PrivateRoute><WorkspacesPage /></PrivateRoute>} />
        <Route path="/channels" element={<PrivateRoute><ChannelsPage /></PrivateRoute>} />
        <Route path="/tasks" element={<PrivateRoute><TasksPage /></PrivateRoute>} />
        <Route path="/messages" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
        <Route path="/files" element={<PrivateRoute><FilesPage /></PrivateRoute>} />
        <Route path="/backend-storage" element={<PrivateRoute><BackendStorage /></PrivateRoute>} />
        <Route path="/backend-storage/:collection" element={<PrivateRoute><BackendStorageDetails /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
