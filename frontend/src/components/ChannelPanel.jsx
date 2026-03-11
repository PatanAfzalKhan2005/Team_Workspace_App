import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function ChannelPanel() {
  const [name, setName] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [channels, setChannels] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [channelRes, workspaceRes] = await Promise.all([
        API.get("/channel/all"),
        API.get("/workspace")
      ]);
      setChannels(channelRes.data || []);
      setWorkspaces(workspaceRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      await API.post("/channel/create", { name, workspaceId });
      setName("");
      setWorkspaceId("");
      loadData();
    } catch (err) {
      alert("Error creating channel");
    }
  };

  return (
    <div>
      <h2>Channels</h2>
      
      <div className="card">
        <h4>Create Channel</h4>
        <form onSubmit={create}>
          <input 
            placeholder="Channel name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select 
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 8, marginTop: 8 }}
          >
            <option value="">Select Workspace</option>
            {workspaces.map(w => (
              <option key={w._id} value={w._id}>{w.name}</option>
            ))}
          </select>
          <button type="submit" style={{ marginTop: 8 }}>Create Channel</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>
        {channels.length === 0 ? (
          <p>No channels yet. Create one to get started!</p>
        ) : (
          channels.map((c, idx) => (
            <div 
              key={c._id} 
              className="workspace-card"
              onClick={() => navigate(`/channel/${c._id}`, { state: { channel: c } })}
              style={{ 
                cursor: 'pointer',
                animation: `cardEntrance 0.4s ease forwards`,
                animationDelay: `${idx * 0.05}s`,
                opacity: 0
              }}
            >
              <h4>📡 {c.name}</h4>
              <p>Workspace: {c.workspace?.name || 'Unknown'}</p>
              <p style={{ fontSize: 12, opacity: 0.7 }}>{new Date(c.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}