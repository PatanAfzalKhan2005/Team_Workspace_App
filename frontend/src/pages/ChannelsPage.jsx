import { useEffect, useState } from "react";
import API from "../api/api";
import AppShell from "../components/AppShell";
import { notifyWorkspaceDataChanged, subscribeToWorkspaceDataChanges } from "../utils/session";

export default function ChannelsPage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [channels, setChannels] = useState([]);
  const [form, setForm] = useState({ name: "", workspaceId: "" });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [workspaceRes, channelRes] = await Promise.all([
          API.get("/workspace"),
          API.get("/channel/all")
        ]);

        if (!mounted) {
          return;
        }

        const nextWorkspaces = workspaceRes.data || [];
        setWorkspaces(nextWorkspaces);
        setChannels(channelRes.data || []);
        setForm((current) => ({
          ...current,
          workspaceId: current.workspaceId || nextWorkspaces[0]?._id || ""
        }));
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
    const unsubscribe = subscribeToWorkspaceDataChanges(loadData);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const createChannel = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.workspaceId) {
      return;
    }

    try {
      await API.post("/channel/create", {
        name: form.name.trim(),
        workspaceId: form.workspaceId
      });
      setForm((current) => ({ ...current, name: "" }));
      notifyWorkspaceDataChanged();
    } catch (error) {
      console.error(error);
      alert("Unable to create channel.");
    }
  };

  return (
    <AppShell title="Channels" subtitle="Browse your channels and create new ones inside an existing workspace.">
      <section className="content-two-column">
        <form className="card entity-form-card" onSubmit={createChannel}>
          <p className="section-label">Create Channel</p>
          <h3>New channel</h3>
          <select
            value={form.workspaceId}
            onChange={(event) => setForm((current) => ({ ...current, workspaceId: event.target.value }))}
          >
            <option value="">Select workspace</option>
            {workspaces.map((workspace) => (
              <option key={workspace._id} value={workspace._id}>
                {workspace.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Channel name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
          <button type="submit">Create Channel</button>
        </form>

        <div className="card">
          <div className="section-heading">
            <div>
              <p className="section-label">Channel List</p>
              <h3>{channels.length} channels</h3>
            </div>
          </div>

          <div className="entity-list">
            {channels.map((channel) => (
              <article key={channel._id} className="entity-row">
                <div>
                  <strong>{channel.name}</strong>
                  <p>Workspace: {channel.workspace?.name || "Unknown workspace"}</p>
                </div>
                <span>{new Date(channel.createdAt).toLocaleDateString()}</span>
              </article>
            ))}
            {channels.length === 0 ? <p className="empty-copy">No channels available.</p> : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
