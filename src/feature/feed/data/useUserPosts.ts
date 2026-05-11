"use client";

import { useCallback, useEffect, useState } from "react";
import type { FeedPostData } from "./types";

const STORAGE_KEY = "feed.userPosts.v1";

function loadFromStorage(): FeedPostData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FeedPostData[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(posts: FeedPostData[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    /* ignore quota errors */
  }
}

export function useUserPosts() {
  const [posts, setPosts] = useState<FeedPostData[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveToStorage(posts);
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

  return { posts, hydrated, addPost, removePost, updatePost };
}
