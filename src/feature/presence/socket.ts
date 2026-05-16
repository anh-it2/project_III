import { Socket } from "socket.io-client";
import {
  PresenceClientToServerEvents,
  PresenceServerToClientEvents,
} from "./dto/presence.dto";
import { getNamespaceSocket } from "@/socket/client/manager";
import { useAuthStore } from "../auth/stores/auth.store";
import { usePresenceStore } from "./stores/presence.store";

export type PresenceSocket = Socket<
  PresenceServerToClientEvents,
  PresenceClientToServerEvents
>;

export function getPresenceSocket(): PresenceSocket {
  const { userId, userName } = useAuthStore.getState();
  return getNamespaceSocket<PresenceSocket>("/presence", { userId, userName });
}

/** Self image URL lives in profile meta (localStorage); editable on the edit-profile page. */
function readSelfAvatar(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem("profile.meta.v1");
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { avatarUrl?: string };
    return parsed?.avatarUrl || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Publish the current user's image (and optionally name) to everyone.
 * Call on connect and again whenever the avatar is changed on edit-profile —
 * the handshake fires only once, so updates must travel as an event.
 */
export function publishPresenceProfile(avatar?: string) {
  const socket = getPresenceSocket();
  socket.emit("presence:update-profile", {
    avatar: avatar ?? readSelfAvatar() ?? "",
  });
}

let initialized = false;

export function initPresence() {
  if (initialized) return;
  initialized = true;

  const { userId } = useAuthStore.getState();
  const socket = getPresenceSocket();
  const store = usePresenceStore.getState();

  socket.on("presence:user-joined", (u) => {
    if (u.id === userId) return;
    usePresenceStore.getState().addOnlineUser(u);
  });

  socket.on("presence:user-left", (id) => {
    usePresenceStore.getState().removeOnlineUser(id);
  });

  socket.on("presence:user-updated", (u) => {
    if (u.id === userId) return;
    usePresenceStore.getState().updateUser(u);
  });

  socket.emit("presence:get-online-users", (list) => {
    store.setOnlineUsers(list.filter((u) => u.id !== userId));
  });

  // Broadcast our image once connected (re-sent on every reconnect too).
  socket.on("connect", () => publishPresenceProfile());
  if (socket.connected) publishPresenceProfile();
}

export function disposePresence() {
  initialized = false;
  usePresenceStore.getState().reset();
}
