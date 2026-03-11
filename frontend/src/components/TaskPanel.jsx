import { useState, useEffect } from "react";
import API from "../api/api";

export default function TaskPanel({ channelId }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (channelId) loadTasks();
  }, [channelId]);

  const loadTasks = async () => {
    try {
      const res = await API.get(`/task/${channelId}`);
      setTasks(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      await API.post("/task/create", { title, description, channelId });
      setTitle("");
      setDescription("");
      loadTasks();
    } catch (err) {
      alert("Error creating task");
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await API.put(`/task/${taskId}`, { status: newStatus });
      loadTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const groupedTasks = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    done: tasks.filter(t => t.status === 'done')
  };

  return (
    <div>
      <h2>Task Board</h2>
      
      <div className="card">
        <h4>Create Task</h4>
        <form onSubmit={create}>
          <input 
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required 
          />
          <input 
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Create Task</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }}>
        {['todo', 'in-progress', 'done'].map(status => (
          <div key={status} className="card" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h4 style={{ textTransform: 'capitalize', marginBottom: 16 }}>
              {status === 'todo' ? '📝 To Do' : status === 'in-progress' ? '⏳ In Progress' : '✅ Done'} ({groupedTasks[status].length})
            </h4>
            {groupedTasks[status].map((t, idx) => (
              <div 
                key={t._id} 
                className="task-item"
                style={{ 
                  animation: `cardEntrance 0.4s ease forwards`,
                  animationDelay: `${idx * 0.05}s`,
                  opacity: 0
                }}
              >
                <strong>{t.title}</strong>
                {t.description && <p style={{ fontSize: 13, margin: '4px 0' }}>{t.description}</p>}
                <span style={{ fontSize: 11 }}>By: {t.createdBy?.name || 'Unknown'}</span>
                <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                  {status !== 'todo' && (
                    <button onClick={() => updateStatus(t._id, 'todo')} style={{ fontSize: 11, padding: '4px 8px' }}>To Do</button>
                  )}
                  {status !== 'in-progress' && (
                    <button onClick={() => updateStatus(t._id, 'in-progress')} style={{ fontSize: 11, padding: '4px 8px' }}>In Progress</button>
                  )}
                  {status !== 'done' && (
                    <button onClick={() => updateStatus(t._id, 'done')} style={{ fontSize: 11, padding: '4px 8px' }}>Done</button>
                  )}
                </div>
              </div>
            ))}
            {groupedTasks[status].length === 0 && (
              <p style={{ textAlign: 'center', opacity: 0.5, fontSize: 13 }}>No tasks</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}