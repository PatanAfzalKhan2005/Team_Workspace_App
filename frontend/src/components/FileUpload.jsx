import API from "../api/api";

export default function FileUpload() {
  const upload = async (e) => {
    const form = new FormData();

    form.append("file", e.target.files[0]);
    form.append("channelId", "CHANNEL_ID");

    await API.post("/file/upload", form);

    alert("File Uploaded");
  };

  return (
    <div className="box">
      <h3>Upload File</h3>

      <input type="file" onChange={upload} />
    </div>
  );
}
