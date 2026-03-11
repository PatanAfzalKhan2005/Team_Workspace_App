import { useContext, useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { AuthContext } from "../context/AuthContext";
import { subscribeToWorkspaceDataChanges } from "../utils/session";
import { fetchDashboardSnapshot } from "../utils/workspaceData";

export default function WorkspacesPage() {
  const { user, updateUser } = useContext(AuthContext);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    let mounted = true;

    const loadWorkspaces = async () => {
      try {
        const snapshot = await fetchDashboardSnapshot(user?.email);
        if (!mounted) {
          return;
        }

        setWorkspaces(snapshot.workspaceDetails);
        if (snapshot.currentUser?.name && snapshot.currentUser?.name !== user?.name) {
          updateUser(snapshot.currentUser);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadWorkspaces();
    const unsubscribe = subscribeToWorkspaceDataChanges(loadWorkspaces);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [user?.email, user?.name]);

  return (
    <AppShell
      title="Workspaces"
      subtitle="Single workspace listing with aggregated channel, task, message, and file counts."
    >
      <section className="panel-stack">
        {workspaces.length === 0 ? (
          <div className="card">
            <p className="empty-copy">No workspaces available yet.</p>
          </div>
        ) : (
          <div className="workspace-page-grid">
            {workspaces.map((workspace) => (
              <article key={workspace._id} className="card workspace-summary-card">
                <p className="section-label">Workspace</p>
                <h3>{workspace.name}</h3>
                <div className="detail-card-grid compact">
                  <div className="detail-card">
                    <span>Users</span>
                    <strong>{workspace.users}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Channels</span>
                    <strong>{workspace.channels}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Tasks</span>
                    <strong>{workspace.tasks}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Messages</span>
                    <strong>{workspace.messages}</strong>
                  </div>
                  <div className="detail-card">
                    <span>Files</span>
                    <strong>{workspace.files}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
