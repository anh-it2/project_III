"use client";

import { Flex } from "antd";
import { ChatNavBtn } from "./ChatNavBtn";
import { Logo } from "./Logo";
import { NavBtn } from "./NavBtn";
import { NavSearch } from "./NavSearch";
import { UserAvatarBtn } from "./UserAvatarBtn";

export function TopNav() {
  return (
    <Flex
      align="center"
      justify="space-between"
      className="!sticky !top-0 !z-50 !h-16 !w-full !shrink-0 !border-b !px-8"
      style={{ background: "#0a0a0f", borderColor: "#1e1e2e" }}
    >
      <Flex align="center" gap={24}>
        <Logo />
        <NavSearch />
      </Flex>
      <Flex align="center" gap={16}>
        <NavBtn icon="home" active />
        <ChatNavBtn />
        <NavBtn icon="notifications" />
        <UserAvatarBtn />
      </Flex>
    </Flex>
  );
}
