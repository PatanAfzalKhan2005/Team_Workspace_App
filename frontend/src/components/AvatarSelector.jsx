import { useState } from "react";

const avatars = [
  '/src/assets/avatars/avatar1.svg',
  '/src/assets/avatars/avatar2.svg',
  '/src/assets/avatars/avatar3.svg',
  '/src/assets/avatars/avatar4.svg',
  '/src/assets/avatars/avatar5.svg',
  '/src/assets/avatars/avatar6.svg'
];

export default function AvatarSelector({ onSelect }) {
  const [selected, setSelected] = useState(localStorage.getItem('userAvatar') || '');

  const pick = (url) => {
    localStorage.setItem('userAvatar', url);
    setSelected(url);
    if (onSelect) onSelect(url);
  };

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {avatars.map((a) => (
        <img
          key={a}
          src={a}
          alt="avatar"
          onClick={() => pick(a)}
          style={{ width: 56, height: 56, borderRadius: 999, cursor: 'pointer', border: selected === a ? '3px solid var(--accent)' : '2px solid transparent' }}
        />
      ))}
    </div>
  );
}
