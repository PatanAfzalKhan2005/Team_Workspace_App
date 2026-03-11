export default function ChannelCard({ channel, onOpen }) {
  return (
    <div className="channel-card">
      <h4>{channel.name}</h4>
      <button onClick={() => onOpen(channel)}>Open Channel</button>
    </div>
  );
}
