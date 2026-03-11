import API from "../api/api";

export default function Upload({ channelId }) {
  const uploadFile = async (e) => {
    const form = new FormData();

    form.append("file", e.target.files[0]);
    form.append("channelId", channelId);

    await API.post("/file/upload", form);

    alert("Uploaded");
  };

  return (
    <input type="file" onChange={uploadFile} />
  );
}
