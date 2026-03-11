import { useState } from "react";
import API from "../api/api";

export default function FilePanel() {
  const [channelId, setChannelId] = useState("");

  const upload = async (e) => {
    try {
      const form = new FormData();

      form.append("file", e.target.files[0]);
      form.append("channelId", channelId);

      await API.post("/file/upload", form);

      alert("File uploaded");
    } catch (err) {
      alert("Error uploading file");
    }
  };

  return (
    <div className="card">
      <h4>Upload File</h4>

      <input
        placeholder="Channel ID"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
      />

      <input type="file" onChange={upload} />
    </div>
  );
}
