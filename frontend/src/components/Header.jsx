import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";

export default function Header() {
  const { logout, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await API.get('/auth/profile');
        if (mounted) setProfile(res.data);
      } catch (err) {
        // silent
      }
    };
    if (token) load();
    return () => (mounted = false);
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const avatar = localStorage.getItem('userAvatar');

  return (
    <div className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
          <strong style={{ color: 'var(--accent)' }}>W</strong>
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>WorkSpace</div>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          placeholder="Search workspaces, channels, tasks..."
          style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)', background: 'transparent', color: 'var(--text)', width: 420 }}
        />

        <button onClick={() => navigate('/notifications')} style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontSize: 20 }}>🔔</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {avatar ? (
            <img src={avatar} alt="avatar" style={{ width: 38, height: 38, borderRadius: 999, cursor: 'pointer' }} onClick={() => navigate('/profile')} />
          ) : (
            <div onClick={() => navigate('/profile')} style={{ width: 38, height: 38, borderRadius: 999, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontWeight: 700 }}>
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>

        <button className="logout-btn" onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.04)', color: 'var(--text)' }}>Logout</button>
      </div>
    </div>
  );
}
