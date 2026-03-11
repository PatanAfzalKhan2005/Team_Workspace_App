import { useState, useEffect } from "react";
import API from "../api/api";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [channelId, setChannelId] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await API.get(`/message/${channelId}`);
    setMessages(res.data);
  };

  const send = async () => {
    await API.post("/message/send", { content, channelId });

    setContent("");

    load();
  };

  return (
    <div className="box">
      <h3>Chat</h3>

      <input
        placeholder="Channel ID"
        onChange={(e) => setChannelId(e.target.value)}
      />

      <input
        placeholder="Message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={send}>Send</button>

      {messages.map(m => (
        <p key={m._id}>{m.content}</p>
      ))}
    </div>
  );
}
