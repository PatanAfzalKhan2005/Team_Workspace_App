import React from "react";

export default function SyncButton({ onSync, syncing }) {
  return (
    <button className={`sync-button ${syncing ? 'spin' : ''}`} onClick={onSync} aria-label="Sync storage">
      🔄
    </button>
  );
}
