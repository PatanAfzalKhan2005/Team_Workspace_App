import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ChatPanel from "../components/ChatPanel";

export default function Channel() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <div style={{ width: 260 }} />
        <main style={{ marginLeft: 28, padding: 28, flex: 1 }}>
          <button onClick={() => navigate(-1)} style={{ marginBottom: 12, background: 'transparent', border: 'none', color: 'var(--muted)' }}>← Back</button>
          <div className="card">
            <h3>Chat</h3>
            <ChatPanel channelId={id} />
          </div>
        </main>
      </div>
    </div>
  );
}
