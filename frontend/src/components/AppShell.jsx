import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AuthContext } from "../context/AuthContext";

export default function AppShell({ title, subtitle, children }) {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <section className="app-main">
        <header className="app-topbar">
          <div>
            <p className="page-kicker">Workspace Suite</p>
            <h2>{title}</h2>
            {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
          </div>

          <div className="topbar-actions">
            <div className="topbar-user">
              <span className="topbar-user-label">Signed in</span>
              <strong>{user?.name || "Unknown"}</strong>
            </div>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="app-content">{children}</div>
      </section>
    </div>
  );
}
