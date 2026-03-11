import { useState, useEffect } from "react";
import API from "../api/api";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const res = await API.get('/task/all');
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const createTask = async () => {
    try {
      await API.post('/task/create', { title });
      setTitle('');
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const moveTask = async (taskId, status) => {
    try {
      await API.put(`/task/${taskId}`, { status });
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: 'todo', title: 'To Do' },
    { key: 'in-progress', title: 'In Progress' },
    { key: 'done', title: 'Done' }
  ];

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {columns.map(col => (
        <div key={col.key} style={{ flex: 1 }}>
          <div className="card">
            <h4>{col.title}</h4>
            <div>
              {tasks.filter(t => t.status === col.key).map(t => (
                <div key={t._id} style={{ background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ fontWeight: 700 }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.description}</div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    {col.key !== 'todo' && <button onClick={() => moveTask(t._id, 'todo')}>Move to To Do</button>}
                    {col.key !== 'in-progress' && <button onClick={() => moveTask(t._id, 'in-progress')}>Move to In Progress</button>}
                    {col.key !== 'done' && <button onClick={() => moveTask(t._id, 'done')}>Move to Done</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div style={{ width: 320 }}>
        <div className="card">
          <h4>Create Task</h4>
          <input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <button onClick={createTask}>Add</button>
        </div>
      </div>
    </div>
  );
}
