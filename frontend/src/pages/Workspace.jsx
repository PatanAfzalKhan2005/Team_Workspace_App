import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ChannelCard from "../components/ChannelCard";
import API from "../api/api";

export default function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    loadChannels();
  }, [id]);

  const loadChannels = async () => {
    try {
      const res = await API.get(`/channel/workspace/${id}`);
      setChannels(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createChannel = async (e) => {
    e.preventDefault();
    try {
      await API.post("/channel/create", { name, workspaceId: id });
      setName("");
      loadChannels();
    } catch (err) {
      alert("Error creating channel");
    }
  };

  const openChannel = (channel) => {
    navigate(`/channel/${channel._id}`, { state: { channel } });
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <div style={{ width: 260 }} />
        <main style={{ marginLeft: 28, padding: 28, flex: 1 }}>
          <button onClick={() => window.history.back()} style={{ marginBottom: 12, background: 'transparent', border: 'none', color: 'var(--muted)' }}>← Back</button>

          <div className="workspace-page">
            <h2>Channels</h2>

            <div className="channel-grid">
              {channels.map(c => (
                <ChannelCard key={c._id} channel={c} onOpen={openChannel} />
              ))}
            </div>

            <div className="card">
              <h4>Create Channel</h4>
              <form onSubmit={createChannel}>
                <input
                  placeholder="Channel name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <button type="submit">Create</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
