import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const items = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Workspaces", to: "/workspaces" },
  { label: "Channels", to: "/channels" },
  { label: "Tasks", to: "/tasks" },
  { label: "Messages", to: "/messages" },
  { label: "Files", to: "/files" },
  { label: "Backend Storage", to: "/backend-storage" }
];

export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">W</div>
        <div>
          <p className="sidebar-eyebrow">Workspace</p>
          <h1>Control Panel</h1>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
        <ThemeToggle />
      </div>
    </aside>
  );
}
