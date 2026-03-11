import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";
import AppShell from "../components/AppShell";
import CollectionViewer from "../components/CollectionViewer";
import { readTrackedFiles, subscribeToWorkspaceDataChanges } from "../utils/session";

const collectionConfig = {
  users: { title: "User Collection Data", path: "/users" },
  workspaces: { title: "Workspace Collection Data", path: "/workspaces", fallbackPath: "/workspace" },
  tasks: { title: "Task Collection Data", path: "/tasks", fallbackPath: "/task/all" },
  messages: { title: "Message Collection Data", path: "/messages", fallbackPath: "/message/all" },
  files: { title: "File Collection Data", path: "/files" }
};

function deriveUsersFromCollections(workspaces, tasks, messages) {
  const map = new Map();

  workspaces.forEach((workspace) => {
    if (workspace?.owner?._id) {
      map.set(workspace.owner._id, workspace.owner);
    }

    (workspace?.members || []).forEach((member, index) => {
      if (typeof member === "string") {
        map.set(member, { _id: member, name: `Member ${index + 1}` });
      } else if (member?._id) {
        map.set(member._id, member);
      }
    });
  });

  tasks.forEach((task) => {
    if (task?.createdBy?._id) {
      map.set(task.createdBy._id, task.createdBy);
    }
  });

  messages.forEach((message) => {
    if (message?.sender?._id) {
      map.set(message.sender._id, message.sender);
    }
  });

  return Array.from(map.values());
}

async function fetchCollectionDocuments(collectionKey) {
  const config = collectionConfig[collectionKey];

  if (!config) {
    return [];
  }

  if (collectionKey === "files") {
    try {
      const response = await API.get(config.path);
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return readTrackedFiles();
    }
  }

  if (collectionKey === "users") {
    try {
      const response = await API.get(config.path);
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      const [workspacesRes, tasksRes, messagesRes] = await Promise.all([
        API.get("/workspace"),
        API.get("/task/all"),
        API.get("/message/all")
      ]);

      return deriveUsersFromCollections(
        Array.isArray(workspacesRes.data) ? workspacesRes.data : [],
        Array.isArray(tasksRes.data) ? tasksRes.data : [],
        Array.isArray(messagesRes.data) ? messagesRes.data : []
      );
    }
  }

  try {
    const response = await API.get(config.path);
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    if (config.fallbackPath) {
      const fallbackResponse = await API.get(config.fallbackPath);
      return Array.isArray(fallbackResponse.data) ? fallbackResponse.data : [];
    }
    throw new Error(`Unable to load ${collectionKey}`);
  }
}

export default function BackendStorageDetails() {
  const { collection } = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = useMemo(() => collectionConfig[collection], [collection]);

  useEffect(() => {
    let mounted = true;

    const loadDocuments = async () => {
      if (!config) {
        setDocuments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const nextDocuments = await fetchCollectionDocuments(collection);
        if (mounted) {
          setDocuments(nextDocuments);
        }
      } catch (error) {
        console.error(error);
        if (mounted) {
          setDocuments([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDocuments();
    const unsubscribe = subscribeToWorkspaceDataChanges(loadDocuments);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [collection, config]);

  return (
    <AppShell
      title="Backend Storage"
      subtitle="Document-level collection view using the existing API responses available to the frontend."
    >
      <div style={{ display: "grid", gap: 20 }}>
        <div>
          <Link
            to="/backend-storage"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "var(--accent)",
              fontWeight: 700
            }}
          >
            ← Back to storage cards
          </Link>
        </div>

        {loading ? (
          <section
            style={{
              background: "var(--panel)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow)",
              padding: 24,
              color: "var(--muted)"
            }}
          >
            Loading collection data...
          </section>
        ) : (
          <CollectionViewer title={config?.title || "Collection Data"} documents={documents} />
        )}
      </div>
    </AppShell>
  );
}
