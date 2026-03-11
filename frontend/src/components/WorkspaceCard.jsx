export default function WorkspaceCard({ workspace, onOpen }) {
  const created = workspace.createdAt ? new Date(workspace.createdAt).toLocaleDateString() : "-";
  const description = workspace.description || workspace.desc || 'No description';

  return (
    <div className="workspace-card card-gradient" onClick={() => onOpen(workspace)} style={{ cursor: 'pointer' }}>
      <h3 className="ws-title">{workspace.name}</h3>
      <p className="ws-desc">{description}</p>
      <div className="ws-meta">Created: {created}</div>
    </div>
  );
}
