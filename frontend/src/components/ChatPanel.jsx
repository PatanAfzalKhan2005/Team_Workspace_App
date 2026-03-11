import { useState, useEffect } from "react";
import API from "../api/api";

export default function ChatPanel({ channelId }) {
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(channelId || "");

  useEffect(() => {
    loadChannels();
  }, []);

  useEffect(() => {
    if (selectedChannel) loadMessages();
  }, [selectedChannel]);

  const loadChannels = async () => {
    try {
      const res = await API.get("/channel/all");
      setChannels(res.data || []);
      if (res.data?.length > 0 && !selectedChannel) {
        setSelectedChannel(res.data[0]._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadMessages = async () => {
    try {
      const res = await API.get(`/message/${selectedChannel}`);
      setMessages(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const send = async (e) => {
    e.preventDefault();
    if (!selectedChannel) {
      alert("Please select a channel first");
      return;
    }
    try {
      await API.post("/message/send", { content, channelId: selectedChannel });
      setContent("");
      loadMessages();
    } catch (err) {
      alert("Error sending message");
    }
  };

  return (
    <div>
      <h2>Messages</h2>
      
      {channels.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <select 
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            style={{ width: '100%', padding: 10, borderRadius: 8 }}
          >
            <option value="">Select Channel</option>
            {channels.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="card">
        <h4>💬 Chat</h4>

        <div className="message-list" style={{ maxHeight: 400, overflowY: 'auto', marginBottom: 16 }}>
          {messages.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.6 }}>No messages yet. Start the conversation!</p>
          ) : (
            messages.reverse().map((m, idx) => (
              <div 
                key={m._id} 
                className="message-item"
                style={{ 
                  animation: `cardEntrance 0.3s ease forwards`,
                  animationDelay: `${idx * 0.03}s`,
                  opacity: 0
                }}
              >
                <strong>{m.sender?.name || 'User'}</strong>
                <p style={{ margin: '4px 0' }}>{m.content}</p>
                <span>{new Date(m.createdAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>

        <form onSubmit={send} style={{ display: 'flex', gap: 8 }}>
          <input 
            placeholder="Type a message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit">🚀 Send</button>
        </form>
      </div>
    </div>
  );
}