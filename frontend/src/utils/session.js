const USER_STORAGE_KEY = "user";
const FILE_STORAGE_KEY = "workspace_uploaded_files";
const DATA_EVENT = "workspace-data-changed";

export function readStoredUser() {
  try {
    const value = localStorage.getItem(USER_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function writeStoredUser(user) {
  if (!user) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function clearSessionStorage() {
  localStorage.removeItem("token");
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function guessNameFromEmail(email) {
  if (!email || !email.includes("@")) {
    return "Unknown";
  }

  const [prefix] = email.split("@");
  if (!prefix) {
    return "Unknown";
  }

  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

export function notifyWorkspaceDataChanged() {
  window.dispatchEvent(new Event(DATA_EVENT));
}

export function subscribeToWorkspaceDataChanges(callback) {
  window.addEventListener(DATA_EVENT, callback);
  return () => window.removeEventListener(DATA_EVENT, callback);
}

export function readTrackedFiles() {
  try {
    const value = localStorage.getItem(FILE_STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function trackUploadedFile(file) {
  const files = readTrackedFiles();
  const nextFiles = [file, ...files];
  localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(nextFiles));
  notifyWorkspaceDataChanged();
  return nextFiles;
}
