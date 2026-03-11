import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

const defaultTheme = {
  "--bg": "#09111f",
  "--bg-alt": "#0f1b31",
  "--sidebar": "#0d1729",
  "--panel": "rgba(15, 25, 44, 0.92)",
  "--panel-strong": "#14233d",
  "--card": "#162742",
  "--card-soft": "#1b3154",
  "--line": "rgba(160, 181, 215, 0.16)",
  "--text": "#eff6ff",
  "--muted": "#94a8c6",
  "--accent": "#59d5ff",
  "--accent-strong": "#1ca4d6",
  "--success": "#56d69c",
  "--danger": "#ff8f70",
  "--shadow": "0 24px 80px rgba(0, 0, 0, 0.32)"
};

const phonePeTheme = {
  "--bg": "#F5F3FF",
  "--bg-alt": "#E9D5FF",
  "--sidebar": "#E9D5FF",
  "--panel": "rgba(255, 255, 255, 0.96)",
  "--panel-strong": "#FFFFFF",
  "--card": "#FFFFFF",
  "--card-soft": "#F5F3FF",
  "--line": "rgba(95, 37, 159, 0.16)",
  "--text": "#1F2937",
  "--muted": "#5b4b74",
  "--accent": "#5F259F",
  "--accent-strong": "#7E3AF2",
  "--success": "#4fa76c",
  "--danger": "#d96b6b",
  "--shadow": "0 18px 36px rgba(95, 37, 159, 0.12)"
};

function applyTheme(themeName) {
  const root = document.documentElement;
  const theme = themeName === "phonepe" ? phonePeTheme : defaultTheme;

  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.style.setProperty("--radius", themeName === "phonepe" ? "26px" : "22px");
}

export default function ThemeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) || "default";
    setEnabled(savedTheme === "phonepe");
    applyTheme(savedTheme);
  }, []);

  const handleToggle = () => {
    const nextEnabled = !enabled;
    const nextTheme = nextEnabled ? "phonepe" : "default";
    setEnabled(nextEnabled);
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle theme"
      aria-pressed={enabled}
      style={{
        width: 58,
        height: 32,
        borderRadius: 999,
        border: "1px solid var(--line)",
        background: enabled ? "var(--accent)" : "rgba(255,255,255,0.08)",
        padding: 3,
        display: "inline-flex",
        alignItems: "center",
        transition: "background 0.2s ease"
      }}
    >
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: enabled ? "#ffffff" : "var(--text)",
          transform: enabled ? "translateX(26px)" : "translateX(0)",
          transition: "transform 0.2s ease, background 0.2s ease",
          boxShadow: "0 6px 14px rgba(0,0,0,0.18)"
        }}
      />
    </button>
  );
}
