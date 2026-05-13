"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import {
  loadUserPostsFromStorage,
  saveUserPostsToStorage,
} from "@/feature/feed/data/userPostsStorage";
import { getReportSocket } from "../socket";
import type { ReportPostRemovedDTO } from "../dto/report.dto";

/**
 * Mount once at top-level (protected layout). When an admin approves a
 * report, the server broadcasts `report:post-removed`; every client purges
 * the offending post from its local userPosts and rebroadcasts on the
 * BroadcastChannel so other tabs of the same browser also update.
 */
export function useReportPostListener() {
  const isLoggined = useAuthStore((s) => s.isLoggined);

  useEffect(() => {
    if (!isLoggined) return;
    const socket = getReportSocket();
    if (!socket) return;

    const handler = (data: ReportPostRemovedDTO) => {
      if (!data?.postId) return;

      try {
        const posts = loadUserPostsFromStorage();
        const next = posts.filter((p) => p.id !== data.postId);
        if (next.length !== posts.length) saveUserPostsToStorage(next);
      } catch {
        /* noop */
      }

      try {
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const ch = new BroadcastChannel("admin:report");
          ch.postMessage({
            type: "post-removed",
            postId: data.postId,
            postOwnerId: data.postOwnerId,
          });
          ch.close();
        }
      } catch {
        /* noop */
      }
    };

    socket.on("report:post-removed", handler);
    return () => {
      socket.off("report:post-removed", handler);
    };
  }, [isLoggined]);
}
