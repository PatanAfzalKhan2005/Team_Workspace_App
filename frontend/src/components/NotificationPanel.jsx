import { useEffect, useState } from "react";
import API from "../api/api";

export default function NotificationPanel() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get("/notifications");
    setNotes(res.data);
  };

  return (
    <div className="card">
      <h4>Notifications</h4>

      {notes.length === 0 ? "No notifications" :
        notes.map(n => (
          <p key={n._id}>{n.message}</p>
        ))
      }
    </div>
  );
}
