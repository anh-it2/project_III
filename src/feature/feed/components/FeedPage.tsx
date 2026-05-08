"use client";

import { Flex } from "antd";
import { CenterFeed } from "./center/CenterFeed";
import { LeftSidebar } from "./leftsidebar/LeftSidebar";
import { RightSidebar } from "./rightsidebar/RightSidebar";
import { FeedTopNav } from "./topnav/FeedTopNav";

export function FeedPage() {
  return (
    <Flex
      vertical
      className="!min-h-screen !w-full"
      style={{ background: "#0a0a0a" }}
    >
      <FeedTopNav />
      <Flex className="!w-full !flex-1 !items-stretch">
        <LeftSidebar />
        <CenterFeed />
        <RightSidebar />
      </Flex>
    </Flex>
  );
}
