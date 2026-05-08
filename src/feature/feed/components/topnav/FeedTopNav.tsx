"use client";

import { Flex } from "antd";
import { CenterTabs } from "./CenterTabs";
import { FeedLogo } from "./FeedLogo";
import { FeedSearch } from "./FeedSearch";
import { RoundIconBtn } from "./RoundIconBtn";
import { UserAvatar } from "./UserAvatar";

export function FeedTopNav() {
  return (
    <Flex
      align="center"
      justify="space-between"
      gap={8}
      className="!sticky !top-0 !z-50 !h-14 !w-full !shrink-0 !border-b !px-4"
      style={{ background: "#141414", borderColor: "#2e2e2e" }}
    >
      <Flex align="center" gap={8} className="!flex-1 !basis-0">
        <FeedLogo />
        <FeedSearch />
      </Flex>
      <CenterTabs />
      <Flex align="center" justify="end" gap={8} className="!flex-1 !basis-0">
        <RoundIconBtn icon="apps" />
        <RoundIconBtn icon="chat_bubble" />
        <RoundIconBtn icon="notifications" />
        <UserAvatar />
      </Flex>
    </Flex>
  );
}
