import { useState, useEffect } from "react";
import API from "../api/api";

export default function FileUploadPanel({ channelId }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadFiles();
  }, [channelId]);

  const loadFiles = async () => {
    try {
      const res = await API.get(`/file/${channelId}`);
      setFiles(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const upload = async (e) => {
    try {
      const form = new FormData();
      form.append("file", e.target.files[0]);
      form.append("channelId", channelId);

      await API.post("/file/upload", form);
      alert("File uploaded");
      loadFiles();
    } catch (err) {
      alert("Error uploading file");
    }
  };

  return (
    <div className="card">
      <h4>File Upload</h4>

      <input type="file" onChange={upload} />

      <div className="file-list">
        <h5>Uploaded Files</h5>
        {files.length === 0 ? (
          <p>No files yet</p>
        ) : (
          files.map(f => (
            <div key={f._id} className="file-item">
              <a href={`http://localhost:5001/uploads/${f.filename}`} target="_blank" rel="noreferrer">
                {f.originalName}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
