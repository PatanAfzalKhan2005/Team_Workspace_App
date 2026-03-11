import { useEffect, useState } from "react";
import API from "../api/api";

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const res = await API.get("/activity");
      setActivities(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card">
      <h3>Activity Feed</h3>
      {activities.length === 0 ? (
        <p>No activities yet</p>
      ) : (
        activities.map(activity => (
          <div key={activity._id} className="activity-item">
            <strong>{activity.user?.name || 'User'}</strong> {activity.action}
            <span className="activity-date">{new Date(activity.createdAt).toLocaleString()}</span>
          </div>
        ))
      )}
    </div>
  );
}
