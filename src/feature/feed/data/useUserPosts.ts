"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { FeedPostData } from "./types";
import {
  loadUserPostsFromStorage,
  saveUserPostsToStorage,
} from "./userPostsStorage";

export function useUserPosts() {
  const userId = useAuthStore((s) => s.userId);
  // Posts are tied to the account they were loaded under so an account
  // switch can't write the previous user's posts into the new scope.
  const [state, setState] = useState<{ scope: string; posts: FeedPostData[] }>({
    scope: userId,
    posts: [],
  });
  const [hydrated, setHydrated] = useState(false);
  const posts = state.posts;

  // Re-hydrate on account switch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ scope: userId, posts: loadUserPostsFromStorage() });
    setHydrated(true);
  }, [userId]);

  useEffect(() => {
    if (hydrated && state.scope === userId) saveUserPostsToStorage(state.posts);
  }, [state, hydrated, userId]);

  const addPost = useCallback((post: FeedPostData) => {
    setState((prev) => ({ ...prev, posts: [post, ...prev.posts] }));
  }, []);

  const removePost = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== id),
    }));
  }, []);

  const updatePost = useCallback((updated: FeedPostData) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p.id === updated.id ? updated : p)),
    }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const ch = new BroadcastChannel("admin:report");
    const handler = (e: MessageEvent) => {
      const data = e.data as { type?: string; postId?: string } | undefined;
      if (data?.type === "post-removed" && data.postId) {
        setState((prev) => ({
          ...prev,
          posts: prev.posts.filter((p) => p.id !== data.postId),
        }));
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
