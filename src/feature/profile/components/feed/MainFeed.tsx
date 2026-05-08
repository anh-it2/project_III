"use client";

import { Flex } from "antd";
import { POSTS } from "../../data/mock";
import { PostCard } from "./PostCard";
import { PostComposer } from "./PostComposer";

export function MainFeed() {
  return (
    <Flex vertical gap={20} className="!flex-1">
      <PostComposer />
      {POSTS.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </Flex>
  );
}
