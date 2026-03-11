# 🎨 UI/UX Design Guide

## 🌈 Color Palette

### Primary Colors
```css
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--purple-light: #667eea
--purple-dark: #764ba2
```

### Status Colors
```css
--success: #4ade80 (Green - Active/Done)
--error: #f87171 (Red - Inactive/Error)
--warning: #fbbf24 (Yellow - In Progress)
```

### Glass Effect Colors
```css
--glass-bg: rgba(255, 255, 255, 0.1)
--glass-border: rgba(255, 255, 255, 0.18)
--glass-text: rgba(255, 255, 255, 0.9)
--glass-text-muted: rgba(255, 255, 255, 0.7)
```

---

## 🎭 Glassmorphism Effect

### Standard Glass Card
```css
.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
```

### Hover Effect
```css
.glass-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 45px 0 rgba(31, 38, 135, 0.5);
  border-color: rgba(255, 255, 255, 0.3);
}
```

---

## ✨ Animations

### Card Entrance
```css
@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Usage */
.storage-card {
  animation: cardEntrance 0.5s ease forwards;
  animation-delay: calc(var(--index) * 0.05s);
}
```

### Spin Animation
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Usage */
.sync-button.spin {
  animation: spin 1s linear infinite;
}
```

### Pulse Animation
```css
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.3; }
}

/* Usage for loading skeletons */
.skeleton-line {
  animation: pulse 1.5s ease-in-out infinite;
}
```

---

## 📐 Layout Patterns

### Responsive Grid
```css
.storage-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .storage-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .storage-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
```

### Kanban Board Layout
```css
.task-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
```

---

## 🎯 Component Styles

### Status Dot
```css
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  top: 16px;
  right: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.status-dot.active {
  background: #4ade80;
  box-shadow: 0 0 10px #4ade80;
}

.status-dot.inactive {
  background: #f87171;
  box-shadow: 0 0 10px #f87171;
}
```

### Floating Sync Button
```css
.sync-button {
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.sync-button:hover {
  transform: scale(1.1);
  box-shadow: 0 15px 50px rgba(102, 126, 234, 0.6);
}
```

### Toast Notification
```css
.storage-toast {
  position: fixed;
  right: 32px;
  bottom: 110px;
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 12px 18px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

## 🔤 Typography

### Headings
```css
h2 {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

h3 {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
}

h4 {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 8px 0;
}
```

### Body Text
```css
p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
}

.muted {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.small {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}
```

---

## 🎪 Interactive Elements

### Buttons
```css
button {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

button:active {
  transform: translateY(0);
}
```

### Input Fields
```css
input, select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 14px;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small devices (phones, 640px and down) */
@media (max-width: 640px) {
  .storage-grid { grid-template-columns: 1fr; }
  .task-board { grid-template-columns: 1fr; }
}

/* Medium devices (tablets, 641px to 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .storage-grid { grid-template-columns: repeat(2, 1fr); }
  .task-board { grid-template-columns: repeat(2, 1fr); }
}

/* Large devices (desktops, 1025px and up) */
@media (min-width: 1025px) {
  .storage-grid { grid-template-columns: repeat(4, 1fr); }
  .task-board { grid-template-columns: repeat(3, 1fr); }
}
```

---

## 🎨 Icon Usage

### Emoji Icons
```
🏢 - Workspace
📡 - Channel
✅ - Completed Task
📝 - Todo Task
⏳ - In Progress Task
💬 - Message
📦 - Storage
🔄 - Sync/Refresh
🚀 - Send
🏠 - Dashboard
```

---

## ⚡ Performance Tips

1. **Use CSS transforms** instead of position changes
2. **Limit backdrop-filter** usage (expensive operation)
3. **Use will-change** for animated elements
4. **Optimize animation delays** (0.05s increments)
5. **Lazy load images** if adding them later

---

## 🎯 Accessibility

1. **Color Contrast**: Ensure text is readable on glass backgrounds
2. **Focus States**: Add visible focus indicators for keyboard navigation
3. **ARIA Labels**: Add labels for icon-only buttons
4. **Semantic HTML**: Use proper heading hierarchy
5. **Alt Text**: Provide alt text for any images

---

## 🌟 Best Practices

1. **Consistent Spacing**: Use 8px grid system (8, 16, 24, 32px)
2. **Smooth Transitions**: Keep animations under 0.5s
3. **Visual Hierarchy**: Use size, weight, and color to guide users
4. **Loading States**: Show skeletons or spinners during data fetch
5. **Empty States**: Provide helpful messages when no data exists

---

**Design System Version**: 1.0
**Last Updated**: 2024
