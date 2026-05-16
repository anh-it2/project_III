"use client";

import { Flex } from "antd";
import { useMemo } from "react";
import { Composer } from "@/feature/feed/components/center/composer/Composer";
import { CURRENT_USER } from "@/feature/feed/data/constants";
import type { FeedPostData } from "@/feature/feed/data/types";
import { useUserPosts } from "@/feature/feed/data/useUserPosts";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useProfileView } from "../../context/ProfileViewContext";
import { type Post } from "../../data/mock";
import { PostCard } from "./post/PostCard";

function feedToProfilePost(p: FeedPostData): Post {
  const feelingSuffix = p.feeling
    ? ` — ${p.feeling.kind === "feeling" ? "feeling " : ""}${p.feeling.emoji} ${p.feeling.label}`
    : "";
  const sharedSuffix = p.sharedFrom
    ? `\n\n— Shared from ${p.sharedFrom.author.name}: ${p.sharedFrom.text}`
    : "";
  return {
    id: p.id,
    ownerId: p.ownerId ?? p.author.id,
    author: { name: p.author.name, gradient: p.author.gradient },
    time: p.time,
    text: p.text + feelingSuffix + sharedSuffix,
    image: p.imageUrl ?? p.sharedFrom?.imageUrl,
    emojis: "",
    likes: 0,
    comments: p.comments,
    shares: p.shares,
  };
}

export function MainFeed() {
  const { posts: userPosts, addPost } = useUserPosts();
  const view = useProfileView();
  const authUserId = useAuthStore((s) => s.userId);
  const myId = authUserId || CURRENT_USER.id;
  // whose profile this is: self => my id, other => their id
  const ownerId = view.isSelf ? myId : view.personId;

  const allPosts = useMemo<Post[]>(
    () =>
      userPosts.map(feedToProfilePost).filter((p) => p.ownerId === ownerId),
    [userPosts, ownerId],
  );

  const handleCreate = (post: FeedPostData) => {
    addPost(post);
  };

  return (
    <Flex vertical gap={20} className="!flex-1">
      {view.isSelf ? <Composer onCreatePost={handleCreate} /> : null}
      {allPosts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </Flex>
  );
}
