import { useEffect, useState } from "react";
import API from "../api/api";
import AppShell from "../components/AppShell";
import { readTrackedFiles, subscribeToWorkspaceDataChanges, trackUploadedFile } from "../utils/session";

export default function FilesPage() {
  const [channels, setChannels] = useState([]);
  const [trackedFiles, setTrackedFiles] = useState([]);
  const [selectedChannelId, setSelectedChannelId] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const channelRes = await API.get("/channel/all");
        if (!mounted) {
          return;
        }

        const nextChannels = channelRes.data || [];
        setChannels(nextChannels);
        setTrackedFiles(readTrackedFiles());
        setSelectedChannelId((current) => current || nextChannels[0]?._id || "");
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

  const uploadFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !selectedChannelId) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("channelId", selectedChannelId);

      const response = await API.post("/file/upload", formData);
      const currentChannel = channels.find((channel) => channel._id === selectedChannelId);

      setTrackedFiles(
        trackUploadedFile({
          id: response.data?.file?._id || `${Date.now()}`,
          channelId: selectedChannelId,
          channelName: currentChannel?.name || "Unknown channel",
          filename: response.data?.file?.filename || file.name,
          uploadedAt: new Date().toISOString()
        })
      );

      event.target.value = "";
    } catch (error) {
      console.error(error);
      alert("Unable to upload file.");
    }
  };

  return (
    <AppShell
      title="Files"
      subtitle="Upload files with the existing backend endpoint. File totals are refreshed from tracked uploads because the backend does not expose a file listing route."
    >
      <section className="content-two-column">
        <div className="card entity-form-card">
          <p className="section-label">Upload File</p>
          <h3>New file</h3>
          <select value={selectedChannelId} onChange={(event) => setSelectedChannelId(event.target.value)}>
            <option value="">Select channel</option>
            {channels.map((channel) => (
              <option key={channel._id} value={channel._id}>
                {channel.name}
              </option>
            ))}
          </select>
          <input type="file" onChange={uploadFile} />
        </div>

        <div className="card">
          <div className="section-heading">
            <div>
              <p className="section-label">Tracked Files</p>
              <h3>{trackedFiles.length} files</h3>
            </div>
          </div>

          <div className="entity-list">
            {trackedFiles.map((file) => (
              <article key={file.id} className="entity-row">
                <div>
                  <strong>{file.filename}</strong>
                  <p>Channel: {file.channelName}</p>
                </div>
                <span>{new Date(file.uploadedAt).toLocaleString()}</span>
              </article>
            ))}
            {trackedFiles.length === 0 ? <p className="empty-copy">No tracked uploads yet.</p> : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
