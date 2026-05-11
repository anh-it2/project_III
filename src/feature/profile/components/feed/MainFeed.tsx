"use client";

import { Flex } from "antd";
import { useMemo } from "react";
import { Composer } from "@/feature/feed/components/center/composer/Composer";
import type { FeedPostData } from "@/feature/feed/data/types";
import { useUserPosts } from "@/feature/feed/data/useUserPosts";
import { POSTS, type Post } from "../../data/mock";
import { PostCard } from "./post/PostCard";

function feedToProfilePost(p: FeedPostData): Post {
  const feelingSuffix = p.feeling
    ? ` — ${p.feeling.kind === "feeling" ? "feeling " : ""}${p.feeling.emoji} ${p.feeling.label}`
    : "";
  return {
    id: p.id,
    author: { name: p.author.name, gradient: p.author.gradient },
    time: p.time,
    text: p.text + feelingSuffix,
    image: p.imageUrl,
    emojis: "",
    likes: 0,
    comments: p.comments,
    shares: p.shares,
  };
}

export function MainFeed() {
  const { posts: userPosts, addPost } = useUserPosts();

  const allPosts = useMemo<Post[]>(
    () => [...userPosts.map(feedToProfilePost), ...POSTS],
    [userPosts]
  );

  const handleCreate = (post: FeedPostData) => {
    addPost(post);
  };

  return (
    <Flex vertical gap={20} className="!flex-1">
      <Composer onCreatePost={handleCreate} />
      {allPosts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </Flex>
  );
}
