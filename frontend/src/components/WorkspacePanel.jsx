import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function WorkspacePanel() {
  const [workspaces, setWorkspaces] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await API.get("/workspace");
      setWorkspaces(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      await API.post("/workspace/create", { name });
      setName("");
      load();
    } catch (err) {
      alert("Error creating workspace");
    }
  };

  return (
    <div>
      <h2>Workspaces</h2>
      
      <div className="card">
        <h4>Create Workspace</h4>
        <form onSubmit={create}>
          <input
            placeholder="Workspace name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Create</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>
        {workspaces.length === 0 ? (
          <p>No workspaces yet. Create one to get started!</p>
        ) : (
          workspaces.map((w, idx) => (
            <div 
              key={w._id} 
              className="workspace-card"
              onClick={() => navigate(`/workspace/${w._id}`, { state: { workspace: w } })}
              style={{ 
                cursor: 'pointer',
                animation: `cardEntrance 0.4s ease forwards`,
                animationDelay: `${idx * 0.05}s`,
                opacity: 0
              }}
            >
              <h4>{w.name}</h4>
              <p>Owner: {w.owner?.name || 'Unknown'}</p>
              <p style={{ fontSize: 12, opacity: 0.7 }}>{new Date(w.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}