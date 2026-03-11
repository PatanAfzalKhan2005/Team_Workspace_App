import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import AppShell from "../components/AppShell";
import { readTrackedFiles, subscribeToWorkspaceDataChanges } from "../utils/session";

const preferredEndpoints = {
  users: "/users",
  workspaces: "/workspaces",
  tasks: "/tasks",
  messages: "/messages",
  files: "/files"
};

const fallbackEndpoints = {
  workspaces: "/workspace",
  tasks: "/task/all",
  messages: "/message/all"
};

function countKnownUsers({ workspaces, tasks, messages }) {
  const ids = new Set();

  (workspaces || []).forEach((workspace) => {
    if (workspace?.owner?._id) {
      ids.add(workspace.owner._id);
    }
    (workspace?.members || []).forEach((member) => {
      if (typeof member === "string") {
        ids.add(member);
      } else if (member?._id) {
        ids.add(member._id);
      }
    });
  });

  (tasks || []).forEach((task) => {
    if (task?.createdBy?._id) {
      ids.add(task.createdBy._id);
    }
  });

  (messages || []).forEach((message) => {
    if (message?.sender?._id) {
      ids.add(message.sender._id);
    }
  });

  return ids.size;
}

async function fetchCount(path, fallbackPath = null) {
  try {
    const response = await API.get(path);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (fallbackPath) {
      const fallbackResponse = await API.get(fallbackPath);
      return Array.isArray(fallbackResponse.data) ? fallbackResponse.data : [];
    }
    throw error;
  }
}

export default function BackendStorage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    workspaces: 0,
    tasks: 0,
    messages: 0,
    files: 0
  });

  useEffect(() => {
    let mounted = true;

    const loadStorageData = async () => {
      try {
        const [workspaces, tasks, messages] = await Promise.all([
          fetchCount(preferredEndpoints.workspaces, fallbackEndpoints.workspaces),
          fetchCount(preferredEndpoints.tasks, fallbackEndpoints.tasks),
          fetchCount(preferredEndpoints.messages, fallbackEndpoints.messages)
        ]);

        let users = [];
        let files = [];

        try {
          users = await fetchCount(preferredEndpoints.users);
        } catch {
          users = [];
        }

        try {
          files = await fetchCount(preferredEndpoints.files);
        } catch {
          files = readTrackedFiles();
        }

        if (!mounted) {
          return;
        }

        setStats({
          users: users.length || countKnownUsers({ workspaces, tasks, messages }),
          workspaces: workspaces.length,
          tasks: tasks.length,
          messages: messages.length,
          files: files.length
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadStorageData();
    const unsubscribe = subscribeToWorkspaceDataChanges(loadStorageData);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <AppShell
      title="Backend Storage"
      subtitle="Overview of stored records using the existing backend routes available to the frontend."
    >
      <section
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 40
        }}
      >
        {[
          { key: "users", label: "Users", value: stats.users },
          { key: "workspaces", label: "Workspaces", value: stats.workspaces },
          { key: "tasks", label: "Tasks", value: stats.tasks },
          { key: "messages", label: "Messages", value: stats.messages },
          { key: "files", label: "Files", value: stats.files }
        ].map((item) => (
          <article
            key={item.label}
            onClick={() => navigate(`/backend-storage/${item.key}`)}
            style={{
              background: "linear-gradient(180deg, var(--card-soft), var(--card))",
              color: "var(--text)",
              padding: 25,
              borderRadius: 20,
              width: 200,
              textAlign: "center",
              border: "1px solid var(--line)",
              boxShadow: "var(--shadow)",
              cursor: "pointer"
            }}
          >
            <div style={{ color: "var(--muted)", marginBottom: 10 }}>{item.label}</div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>{item.value}</div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
