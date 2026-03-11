import { useEffect, useState } from "react";
import API from "../api/api";
import AppShell from "../components/AppShell";
import { notifyWorkspaceDataChanged, subscribeToWorkspaceDataChanges } from "../utils/session";

export default function MessagesPage() {
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState({ channelId: "", content: "" });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [channelRes, messageRes] = await Promise.all([
          API.get("/channel/all"),
          API.get("/message/all")
        ]);

        if (!mounted) {
          return;
        }

        const nextChannels = channelRes.data || [];
        setChannels(nextChannels);
        setMessages(messageRes.data || []);
        setForm((current) => ({
          ...current,
          channelId: current.channelId || nextChannels[0]?._id || ""
        }));
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

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!form.channelId || !form.content.trim()) {
      return;
    }

    try {
      await API.post("/message/send", {
        channelId: form.channelId,
        content: form.content.trim()
      });
      setForm((current) => ({ ...current, content: "" }));
      notifyWorkspaceDataChanged();
    } catch (error) {
      console.error(error);
      alert("Unable to send message.");
    }
  };

  return (
    <AppShell title="Messages" subtitle="Send messages to channels and review the messages already stored for your account.">
      <section className="content-two-column">
        <form className="card entity-form-card" onSubmit={sendMessage}>
          <p className="section-label">Send Message</p>
          <h3>New message</h3>
          <select
            value={form.channelId}
            onChange={(event) => setForm((current) => ({ ...current, channelId: event.target.value }))}
          >
            <option value="">Select channel</option>
            {channels.map((channel) => (
              <option key={channel._id} value={channel._id}>
                {channel.name}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Type your message"
            value={form.content}
            onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            rows={5}
          />
          <button type="submit">Send Message</button>
        </form>

        <div className="card">
          <div className="section-heading">
            <div>
              <p className="section-label">Message List</p>
              <h3>{messages.length} messages</h3>
            </div>
          </div>

          <div className="entity-list">
            {messages.map((message) => (
              <article key={message._id} className="entity-row tall">
                <div>
                  <strong>{message.channel?.name || "Unknown channel"}</strong>
                  <p>{message.content}</p>
                </div>
                <span>{new Date(message.createdAt).toLocaleString()}</span>
              </article>
            ))}
            {messages.length === 0 ? <p className="empty-copy">No messages available.</p> : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
