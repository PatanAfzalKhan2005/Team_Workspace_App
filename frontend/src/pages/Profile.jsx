import { useEffect, useState } from "react";
import Header from "../components/Header";
import API from "../api/api";
import AvatarSelector from "../components/AvatarSelector";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <div style={{ width: 260 }} />
        <main style={{ marginLeft: 28, padding: 28, flex: 1 }}>
          <button onClick={() => navigate(-1)} style={{ marginBottom: 12, background: 'transparent', border: 'none', color: 'var(--muted)' }}>← Back</button>
          <div className="profile-page">
            <div className="card">
              <h2>Profile</h2>
              {user ? (
                <>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                  <div style={{ marginTop: 12 }}>
                    <h4>Choose Avatar</h4>
                    <AvatarSelector onSelect={(url) => { /* selected */ }} />
                  </div>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
