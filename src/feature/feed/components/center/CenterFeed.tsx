"use client";

import { Flex } from "antd";
import { useMemo, useState } from "react";
import { FEED_POSTS } from "../../data/constants";
import type { FeedPostData } from "../../data/types";
import { useUserPosts } from "../../data/useUserPosts";
import { ReelComposerProvider } from "../../lib/reelComposer";
import { Composer } from "./composer/Composer";
import { FeedPost } from "./post/FeedPost";
import { Stories } from "./stories/Stories";

export function CenterFeed() {
  const { posts: userPosts, addPost, removePost, updatePost } = useUserPosts();
  const [mockPosts, setMockPosts] = useState<FeedPostData[]>(FEED_POSTS);

  const allPosts = useMemo(
    () => [...userPosts, ...mockPosts],
    [userPosts, mockPosts]
  );

  const isUserPost = (id: string) => userPosts.some((p) => p.id === id);

  const handleCreate = (post: FeedPostData) => {
    addPost(post);
  };

  const handleRemove = (id: string) => {
    if (isUserPost(id)) {
      removePost(id);
      return;
    }
    setMockPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdate = (updated: FeedPostData) => {
    if (isUserPost(updated.id)) {
      updatePost(updated);
      return;
    }
    setMockPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  return (
    <ReelComposerProvider>
      <Flex
        vertical
        gap={16}
        className="!mx-auto !w-full !min-w-0 !max-w-[680px] !flex-1 !px-2 !py-3 sm:!px-4 sm:!py-4 lg:!max-w-none lg:!px-10 lg:!py-5"
        style={{ background: "var(--color-bg)" }}
      >
        <Stories />
        <Composer onCreatePost={handleCreate} />
        {allPosts.map((p) => (
          <FeedPost
            key={p.id}
            post={p}
            onRemove={handleRemove}
            onUpdate={handleUpdate}
          />
        ))}
      </Flex>
    </ReelComposerProvider>
  );
}
