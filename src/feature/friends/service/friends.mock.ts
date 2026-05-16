import { useFriendsStore, statusOf } from "../stores/friends.store";
import { emitNotification } from "@/feature/notification/lib/emit";
import type { FriendsService } from "./friends.port";

/** Simulate network latency so UI handles async/optimistic paths correctly. */
const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Mock implementation of FriendsService backed by the persisted Zustand store.
 * Replace with friends.api.ts (same interface) when the backend exists.
 */
export const friendsMock: FriendsService = {
  init() {
    // No mock seeding. Relationships come purely from real interactions:
    // suggestions from presence, incoming requests from the notification
    // bridge, friends from accepted requests.
  },

  getStatus(userId) {
    return statusOf(userId);
  },

  async sendRequest(userId) {
    await delay();
    useFriendsStore.getState()._setStatus(userId, "requested");
    // No friends socket exists — the notification channel is the only
    // cross-user transport. The recipient's bridge turns this into an
    // "incoming" request (works offline too: it's replayed on reconnect
    // via notification:list). emitNotification self-guards
    // logged-out/disconnected/self.
    emitNotification({ recipientId: userId, kind: "friend_request" });
  },

  async cancelRequest(userId) {
    await delay();
    useFriendsStore.getState()._setStatus(userId, "none");
  },

  async acceptRequest(userId) {
    await delay();
    useFriendsStore.getState()._setStatus(userId, "friends");
    // Notify the original sender; their bridge reconciles the edge to
    // "friends" so the relationship is consistent on both sides.
    emitNotification({ recipientId: userId, kind: "friend_accept" });
  },

  async rejectRequest(userId) {
    await delay();
    useFriendsStore.getState()._setStatus(userId, "none");
    emitNotification({ recipientId: userId, kind: "friend_reject" });
  },

  async unfriend(userId) {
    await delay();
    useFriendsStore.getState()._setStatus(userId, "none");
  },
};
