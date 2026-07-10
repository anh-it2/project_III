"use client";

import { useCallback } from "react";
import { useNavigation } from "@/shared/hooks/useNavigation";
import type { Notification } from "../types";

/**
 * Single source of "where does clicking a notification go".
 *
 * Shared by the dropdown row and the push toast so both navigate
 * identically. Marking-read / closing the surface stays with the caller.
 */
export function useNotificationNavigate() {
  const nav = useNavigation();

  return useCallback(
    (n: Notification) => {
      if (n.kind === "mention") {
        if (n.postId) nav.push(`/posts/${n.postId}`);
        return;
      }
      if (n.kind === "friend_request") {
        nav.push("/friends?view=requests");
        return;
      }
      if (n.kind === "friend_accept" || n.kind === "friend_reject") {
        nav.push(`/profile/${n.actorId}`);
        return;
      }
      // Admin got a new report → open the review queue.
      if (n.kind === "report_submitted") {
        nav.push("/admin");
        return;
      }
      // Reporter's post was resolved → open the post it concerned.
      if (n.kind === "report_approved" || n.kind === "report_rejected") {
        if (n.postId) nav.push(`/posts/${n.postId}`);
      }
    },
    [nav],
  );
}
