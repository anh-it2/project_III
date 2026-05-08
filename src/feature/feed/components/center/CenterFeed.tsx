"use client";

import { Flex } from "antd";
import { FEED_POSTS } from "../../data/constants";
import { Composer } from "./Composer";
import { FeedPost } from "./FeedPost";
import { Stories } from "./Stories";

export function CenterFeed() {
  return (
    <Flex
      vertical
      gap={16}
      className="!flex-1 !px-10 !py-5"
      style={{ background: "#0a0a0a" }}
    >
      <Stories />
      <Composer />
      {FEED_POSTS.map((p) => (
        <FeedPost key={p.id} post={p} />
      ))}
    </Flex>
  );
}
