"use client";

import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { StoryCardData } from "./types";
import {
  createStoryService,
  listStoriesService,
} from "../services/story.service";

const STORIES_QUERY_KEY = ["stories"] as const;

/**
 * Stories are BE-backed (social-platform-be /posts/stories → MinIO media).
 * Nothing is persisted in localStorage anymore. The list polls every 15s so
 * other users' fresh stories appear, and drops server-side once past 24h.
 */
export function useUserStories() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: STORIES_QUERY_KEY,
    queryFn: listStoriesService,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
  });

  const stories = data ?? [];

  // Takes the composer's draft card but only sends the create body; the row
  // the BE returns (real id + author from the JWT) is what enters the cache.
  const addStory = useCallback(
    async (story: StoryCardData): Promise<boolean> => {
      if (!story.mediaUrl || !story.mediaType) return false;
      const created = await createStoryService({
        mediaUrl: story.mediaUrl,
        mediaType: story.mediaType,
        caption: story.caption,
        musicId: story.musicId,
      });
      qc.setQueryData<StoryCardData[]>(STORIES_QUERY_KEY, (current = []) => [
        created,
        ...current.filter((i) => i.id !== created.id),
      ]);
      return true;
    },
    [qc],
  );

  const removeStory = useCallback(
    (id: string) => {
      qc.setQueryData<StoryCardData[]>(STORIES_QUERY_KEY, (current = []) =>
        current.filter((s) => s.id !== id),
      );
    },
    [qc],
  );

  return { stories, hydrated: !isLoading, addStory, removeStory };
}
