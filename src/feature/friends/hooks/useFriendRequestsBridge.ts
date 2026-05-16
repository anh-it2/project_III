"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useNotificationStore } from "@/feature/notification/stores/notification.store";
import { useFriendsStore } from "../stores/friends.store";

/**
 * Mount once at top-level (protected layout).
 *
 * There is no friends socket — the notification channel is the only
 * cross-user transport. The sender emits a `friend_request` notification
 * (see friends.mock.sendRequest); this bridge is the recipient side: every
 * `friend_request` notification in the store is turned into an "incoming"
 * friend edge so it shows up in RequestsView ("Friend requests for me").
 *
 * Subscribing to the notification store (not a raw socket listener) means
 * this covers both the live `notification:new` push AND the full
 * `notification:list` replay the client issues on every (re)connect — so a
 * request sent while the recipient was offline still materializes when they
 * come back. `_ingestFriendRequest` is idempotent per notification id, so
 * the repeated replays never resurrect an already-handled request.
 */
export function useFriendRequestsBridge() {
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const notifications = useNotificationStore((s) => s.notifications);

  useEffect(() => {
    if (!isLoggined) return;
    const store = useFriendsStore.getState();
    const { _ingestFriendRequest, _ingestFriendResolution } = store;
    const dev = process.env.NODE_ENV !== "production";
    for (const n of notifications) {
      if (n.kind === "friend_request") {
        if (dev) {
          console.debug("[friend-bridge] friend_request", {
            notifId: n.id,
            actorId: n.actorId,
            actorName: n.actorName,
            alreadyProcessed: !!store.processedRequests[n.id],
            priorStatus: store.status[n.actorId] ?? "none",
          });
        }
        _ingestFriendRequest(n.id, n.actorId, n.actorName);
        if (dev) {
          console.debug(
            "[friend-bridge] after ingest -> status:",
            useFriendsStore.getState().status[n.actorId] ?? "none",
          );
        }
      } else if (n.kind === "friend_accept") {
        _ingestFriendResolution(n.id, n.actorId, n.actorName, "accepted");
      } else if (n.kind === "friend_reject") {
        _ingestFriendResolution(n.id, n.actorId, n.actorName, "rejected");
      }
    }
  }, [isLoggined, notifications]);
}
