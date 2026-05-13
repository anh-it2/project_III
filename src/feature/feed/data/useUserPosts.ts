"use client";

import { useCallback, useEffect, useState } from "react";
import type { FeedPostData } from "./types";
import {
  loadUserPostsFromStorage,
  saveUserPostsToStorage,
} from "./userPostsStorage";

export function useUserPosts() {
  const [posts, setPosts] = useState<FeedPostData[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts(loadUserPostsFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveUserPostsToStorage(posts);
  }, [posts, hydrated]);

  const addPost = useCallback((post: FeedPostData) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  const removePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePost = useCallback((updated: FeedPostData) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const ch = new BroadcastChannel("admin:report");
    const handler = (e: MessageEvent) => {
      const data = e.data as { type?: string; postId?: string } | undefined;
      if (data?.type === "post-removed" && data.postId) {
        setPosts((prev) => prev.filter((p) => p.id !== data.postId));
      }
    };
    ch.addEventListener("message", handler);
    return () => {
      ch.removeEventListener("message", handler);
      ch.close();
    };
  }, []);

  return { posts, hydrated, addPost, removePost, updatePost };
}
