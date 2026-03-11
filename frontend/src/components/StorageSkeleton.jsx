import React from "react";

export default function StorageSkeleton() {
  return (
    <div className="glass-card storage-skeleton">
      <div className="skeleton-icon" />
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
      <div className="skeleton-line tiny" />
    </div>
  );
}
