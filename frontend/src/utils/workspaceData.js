import API from "../api/api";
import {
  guessNameFromEmail,
  readStoredUser,
  readTrackedFiles,
  writeStoredUser
} from "./session";

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function findCurrentUserFromCollections({ workspaces, channels, tasks, messages }, fallbackEmail) {
  const storedUser = readStoredUser();
  const candidates = [
    ...safeArray(workspaces).map((workspace) => workspace?.owner),
    ...safeArray(channels).map((channel) => channel?.createdBy),
    ...safeArray(tasks).map((task) => task?.createdBy),
    ...safeArray(messages).map((message) => message?.sender)
  ].filter(Boolean);

  const matchedCandidate =
    candidates.find((candidate) => storedUser?.email && candidate?.email === storedUser.email) ||
    candidates.find((candidate) => fallbackEmail && candidate?.email === fallbackEmail) ||
    candidates[0];

  const nextUser = {
    name: matchedCandidate?.name || storedUser?.name || guessNameFromEmail(fallbackEmail || storedUser?.email),
    email: matchedCandidate?.email || fallbackEmail || storedUser?.email || ""
  };

  writeStoredUser(nextUser);
  return nextUser;
}

export async function fetchWorkspaceCollections() {
  const [workspacesRes, channelsRes, tasksRes, messagesRes] = await Promise.all([
    API.get("/workspace"),
    API.get("/channel/all"),
    API.get("/task/all"),
    API.get("/message/all")
  ]);

  return {
    workspaces: safeArray(workspacesRes.data),
    channels: safeArray(channelsRes.data),
    tasks: safeArray(tasksRes.data),
    messages: safeArray(messagesRes.data),
    trackedFiles: readTrackedFiles()
  };
}

export async function fetchDashboardSnapshot(fallbackEmail) {
  const collections = await fetchWorkspaceCollections();
  const currentUser = findCurrentUserFromCollections(collections, fallbackEmail);

  const stats = {
    workspaces: collections.workspaces.length,
    tasks: collections.tasks.length,
    messages: collections.messages.length,
    files: collections.trackedFiles.length
  };

  const workspaceDetails = collections.workspaces.map((workspace) => {
    const workspaceChannels = collections.channels.filter(
      (channel) => channel?.workspace?._id === workspace._id || channel?.workspace === workspace._id
    );
    const workspaceChannelIds = new Set(workspaceChannels.map((channel) => channel._id));
    const workspaceTasks = collections.tasks.filter((task) => workspaceChannelIds.has(task?.channel?._id || task?.channel));
    const workspaceMessages = collections.messages.filter((message) =>
      workspaceChannelIds.has(message?.channel?._id || message?.channel)
    );
    const workspaceFiles = collections.trackedFiles.filter((file) => workspaceChannelIds.has(file.channelId));

    return {
      ...workspace,
      users: workspace?.members?.length || 1,
      channels: workspaceChannels.length,
      tasks: workspaceTasks.length,
      messages: workspaceMessages.length,
      files: workspaceFiles.length
    };
  });

  return {
    ...collections,
    currentUser,
    stats,
    workspaceDetails
  };
}
