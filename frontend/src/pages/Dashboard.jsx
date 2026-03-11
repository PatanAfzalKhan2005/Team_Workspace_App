import { useContext, useEffect, useState } from "react";
import API from "../api/api";
import AppShell from "../components/AppShell";
import { AuthContext } from "../context/AuthContext";
import { subscribeToWorkspaceDataChanges, notifyWorkspaceDataChanged } from "../utils/session";
import { fetchDashboardSnapshot } from "../utils/workspaceData";

const defaultStats = { workspaces: 0, tasks: 0, messages: 0, files: 0 };

export default function Dashboard() {
  const { user, updateUser } = useContext(AuthContext);
  const [workspaceName, setWorkspaceName] = useState("");
  const [stats, setStats] = useState(defaultStats);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const snapshot = await fetchDashboardSnapshot(user?.email);
        if (!mounted) {
          return;
        }

        setStats(snapshot.stats);
        setWorkspaces(snapshot.workspaceDetails);
        setSelectedWorkspaceId((currentId) => currentId || snapshot.workspaceDetails[0]?._id || "");

        if (snapshot.currentUser?.name && snapshot.currentUser?.name !== user?.name) {
          updateUser(snapshot.currentUser);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    const unsubscribe = subscribeToWorkspaceDataChanges(loadDashboard);
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [user?.email, user?.name]);

  const createWorkspace = async (event) => {
    event.preventDefault();
    if (!workspaceName.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/workspace/create", { name: workspaceName.trim() });
      setWorkspaceName("");
      notifyWorkspaceDataChanged();
    } catch (error) {
      console.error(error);
      alert("Unable to create workspace.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedWorkspace = workspaces.find((workspace) => workspace._id === selectedWorkspaceId) || null;

  return (
    <AppShell
      title="Dashboard"
      subtitle="Live workspace stats, creation flow, and a single workspace section connected to your backend."
    >
      <section className="dashboard-hero card">
        <div>
          <p className="section-label">User Name</p>
          <h3>{user?.name || "Unknown"}</h3>
          <p className="section-copy">{user?.email || "No email available"}</p>
        </div>

        <form className="workspace-create-form" onSubmit={createWorkspace}>
          <label htmlFor="workspace-name" className="section-label">
            Create Workspace
          </label>
          <div className="workspace-create-row">
            <input
              id="workspace-name"
              placeholder="Workspace name"
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </section>

      <section className="stats-row">
        <div className="stats-card">
          <span>Total Workspaces</span>
          <strong>{stats.workspaces}</strong>
        </div>
        <div className="stats-card">
          <span>Total Tasks</span>
          <strong>{stats.tasks}</strong>
        </div>
        <div className="stats-card">
          <span>Total Messages</span>
          <strong>{stats.messages}</strong>
        </div>
        <div className="stats-card">
          <span>Total Files</span>
          <strong>{stats.files}</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="card">
          <div className="section-heading">
            <div>
              <p className="section-label">Workspace</p>
              <h3>Your Workspaces</h3>
            </div>
          </div>

          {loading ? <p className="empty-copy">Loading workspaces...</p> : null}

          {!loading && workspaces.length === 0 ? (
            <p className="empty-copy">No workspaces available yet.</p>
          ) : (
            <div className="workspace-list-grid">
              {workspaces.map((workspace) => (
                <button
                  key={workspace._id}
                  type="button"
                  className={`workspace-tile${workspace._id === selectedWorkspaceId ? " selected" : ""}`}
                  onClick={() => setSelectedWorkspaceId(workspace._id)}
                >
                  <span className="workspace-tile-title">{workspace.name}</span>
                  <span className="workspace-tile-meta">{workspace.channels} channels</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="section-heading">
            <div>
              <p className="section-label">Workspace Details</p>
              <h3>{selectedWorkspace?.name || "Select a workspace"}</h3>
            </div>
          </div>

          {selectedWorkspace ? (
            <div className="detail-card-grid">
              <div className="detail-card">
                <span>Users</span>
                <strong>{selectedWorkspace.users}</strong>
              </div>
              <div className="detail-card">
                <span>Channels</span>
                <strong>{selectedWorkspace.channels}</strong>
              </div>
              <div className="detail-card">
                <span>Tasks</span>
                <strong>{selectedWorkspace.tasks}</strong>
              </div>
              <div className="detail-card">
                <span>Messages</span>
                <strong>{selectedWorkspace.messages}</strong>
              </div>
              <div className="detail-card">
                <span>Files</span>
                <strong>{selectedWorkspace.files}</strong>
              </div>
            </div>
          ) : (
            <p className="empty-copy">Choose a workspace from the list to see its data.</p>
          )}
        </div>
      </section>
    </AppShell>
  );
}
