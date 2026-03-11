import { useEffect, useState } from "react";
import API from "../api/api";
import AppShell from "../components/AppShell";
import { notifyWorkspaceDataChanged, subscribeToWorkspaceDataChanges } from "../utils/session";

export default function TasksPage() {
  const [channels, setChannels] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", channelId: "" });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [channelRes, taskRes] = await Promise.all([
          API.get("/channel/all"),
          API.get("/task/all")
        ]);

        if (!mounted) {
          return;
        }

        const nextChannels = channelRes.data || [];
        setChannels(nextChannels);
        setTasks(taskRes.data || []);
        setForm((current) => ({
          ...current,
          channelId: current.channelId || nextChannels[0]?._id || ""
        }));
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
    const unsubscribe = subscribeToWorkspaceDataChanges(loadData);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const createTask = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.channelId) {
      return;
    }

    try {
      await API.post("/task/create", {
        title: form.title.trim(),
        description: form.description.trim(),
        channelId: form.channelId
      });
      setForm((current) => ({ ...current, title: "", description: "" }));
      notifyWorkspaceDataChanged();
    } catch (error) {
      console.error(error);
      alert("Unable to create task.");
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await API.put(`/task/${taskId}`, { status });
      notifyWorkspaceDataChanged();
    } catch (error) {
      console.error(error);
      alert("Unable to update task.");
    }
  };

  return (
    <AppShell title="Tasks" subtitle="Create tasks and manage their status with the existing task API.">
      <section className="content-two-column">
        <form className="card entity-form-card" onSubmit={createTask}>
          <p className="section-label">Create Task</p>
          <h3>New task</h3>
          <select
            value={form.channelId}
            onChange={(event) => setForm((current) => ({ ...current, channelId: event.target.value }))}
          >
            <option value="">Select channel</option>
            {channels.map((channel) => (
              <option key={channel._id} value={channel._id}>
                {channel.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Task title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          />
          <textarea
            rows={4}
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          />
          <button type="submit">Create Task</button>
        </form>

        <div className="card">
          <div className="section-heading">
            <div>
              <p className="section-label">Task Board</p>
              <h3>{tasks.length} tasks</h3>
            </div>
          </div>

          <div className="entity-list">
            {tasks.map((task) => (
              <article key={task._id} className="entity-row tall">
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.description || "No description"}</p>
                  <p>Channel: {task.channel?.name || "Unknown channel"}</p>
                </div>

                <select value={task.status} onChange={(event) => updateTaskStatus(task._id, event.target.value)}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </article>
            ))}
            {tasks.length === 0 ? <p className="empty-copy">No tasks available.</p> : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
