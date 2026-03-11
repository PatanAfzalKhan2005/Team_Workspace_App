import { useState, useEffect } from "react";
import API from "../api/api";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StorageCard from "../components/StorageCard";
import StorageSkeleton from "../components/StorageSkeleton";
import "../styles/theme.css";

export default function StorageGallery() {
  const [workspaces, setWorkspaces] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState("");
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });

  const loadData = async () => {
    setLoading(true);
    try {
      const [wsRes, taskRes, channelRes, msgRes] = await Promise.all([
        API.get("/workspace"),
        API.get("/task/all"),
        API.get("/channel/all"),
        API.get("/message/all")
      ]);
      setWorkspaces(wsRes.data || []);
      setTasks(taskRes.data || []);
      setChannels(channelRes.data || []);
      setMessages(msgRes.data || []);
      
      const completed = taskRes.data?.filter(t => t.status === "done").length || 0;
      setStats({
        total: taskRes.data?.length || 0,
        completed,
        active: wsRes.data?.length || 0
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    await loadData();
    setToast("✓ Storage Synced");
    setTimeout(() => setToast(""), 2500);
    setSyncing(false);
  };

  return (
  <div className="storage-page-bg">
      <Header />
      <div className="dashboard-layout">
        <Sidebar />
        <div className="main-content" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <button onClick={() => window.history.back()} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', marginBottom: 8 }}>← Back</button>
              <h2 style={{ margin: 0, color: '#fff', fontSize: 28, fontWeight: 700 }}>📦 Storage Dashboard</h2>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            <div className="glass-card" style={{ animation: 'cardEntrance 0.4s ease forwards', animationDelay: '0s' }}>
              <div style={{ fontSize: 14, color: '#E0E7FF', marginBottom: 8 }}>Total Workspaces</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{stats.active}</div>
            </div>
            <div className="glass-card" style={{ animation: 'cardEntrance 0.4s ease forwards', animationDelay: '0.1s' }}>
              <div style={{ fontSize: 14, color: '#E0E7FF', marginBottom: 8 }}>Total Tasks</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{stats.total}</div>
            </div>
            <div className="glass-card" style={{ animation: 'cardEntrance 0.4s ease forwards', animationDelay: '0.2s' }}>
              <div style={{ fontSize: 14, color: '#E0E7FF', marginBottom: 8 }}>Completed Tasks</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{stats.completed}</div>
            </div>
            <div className="glass-card" style={{ animation: 'cardEntrance 0.4s ease forwards', animationDelay: '0.3s' }}>
              <div style={{ fontSize: 14, color: '#E0E7FF', marginBottom: 8 }}>Messages Sent</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>{messages.length}</div>
            </div>
          </div>

          {loading ? (
            <div className="storage-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <StorageSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {/* Workspaces */}
              <section style={{ marginBottom: 40 }}>
                <h3 style={{ color: '#fff', marginBottom: 16, fontSize: 20 }}>🏢 Workspaces ({workspaces.length})</h3>
                <div className="storage-grid">
                  {workspaces.map((w, idx) => (
                    <StorageCard key={w._id || idx} workspace={w} index={idx} />
                  ))}
                </div>
              </section>

              {/* Channels */}
              <section style={{ marginBottom: 40 }}>
                <h3 style={{ color: '#fff', marginBottom: 16, fontSize: 20 }}>📡 Channels ({channels.length})</h3>
                <div className="storage-grid">
                  {channels.map((c, idx) => (
                    <div key={c._id} className="glass-card storage-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className="status-dot active"></div>
                      <div className="workspace-icon">📡</div>
                      <h4 style={{ margin: '8px 0', color: '#fff', fontSize: 16 }}>{c.name}</h4>
                      <p style={{ fontSize: 12, color: '#E0E7FF', margin: 0 }}>Workspace: {c.workspace?.name || 'N/A'}</p>
                      <div className="created-date">{new Date(c.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tasks */}
              <section style={{ marginBottom: 40 }}>
                <h3 style={{ color: '#fff', marginBottom: 16, fontSize: 20 }}>✅ Tasks ({tasks.length})</h3>
                <div className="storage-grid">
                  {tasks.map((t, idx) => (
                    <div key={t._id} className="glass-card storage-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className={`status-dot ${t.status === 'done' ? 'active' : 'inactive'}`}></div>
                      <div className="workspace-icon">{t.status === 'done' ? '✅' : t.status === 'in-progress' ? '⏳' : '📝'}</div>
                      <h4 style={{ margin: '8px 0', color: '#fff', fontSize: 16 }}>{t.title}</h4>
                      <p style={{ fontSize: 12, color: '#E0E7FF', margin: 0 }}>{t.description || 'No description'}</p>
                      <div style={{ marginTop: 8, padding: '4px 8px', background: t.status === 'done' ? '#9CAB84' : '#C8AAAA', borderRadius: 6, fontSize: 11, display: 'inline-block' }}>
                        {t.status}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Messages */}
              <section style={{ marginBottom: 40 }}>
                <h3 style={{ color: '#fff', marginBottom: 16, fontSize: 20 }}>💬 Recent Messages ({messages.length})</h3>
                <div className="storage-grid">
                  {messages.slice(0, 12).map((m, idx) => (
                    <div key={m._id} className="glass-card storage-card" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className="workspace-icon">💬</div>
                      <p style={{ fontSize: 13, color: '#fff', margin: '8px 0', lineHeight: 1.4 }}>{m.content.substring(0, 80)}{m.content.length > 80 ? '...' : ''}</p>
                      <p style={{ fontSize: 11, color: '#E0E7FF', margin: 0 }}>Channel: {m.channel?.name || 'Unknown'}</p>
                      <div className="created-date">{new Date(m.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {toast && <div className="storage-toast">{toast}</div>}
          <button className={`sync-button ${syncing ? 'spin' : ''}`} onClick={handleSync} disabled={syncing}>
            🔄
          </button>
        </div>
      </div>
    </div>
  );
}