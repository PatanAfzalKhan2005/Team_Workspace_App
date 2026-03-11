import React from "react";

export default function StorageCard({ workspace, index = 0 }) {
  const created = workspace.createdAt ? new Date(workspace.createdAt).toLocaleDateString() : "-";
  const description = workspace.description || workspace.desc || workspace.summary || "No description";

  const style = {
    animationDelay: `${index * 80}ms`
  };

  return (
    <div className="glass-card storage-card" style={style}>
      <div className="workspace-icon">🏷️</div>
      <h4 className="storage-title">{workspace.name}</h4>
      <p className="storage-desc">{description}</p>
      <p className="created-date">{created}</p>
      <div className={`status-dot ${workspace.active ? 'active' : 'inactive'}`}></div>
    </div>
  );
}
