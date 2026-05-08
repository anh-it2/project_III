"use client";

import { Flex } from "antd";
import { ChatNavBtn } from "./ChatNavBtn";
import { Logo } from "./Logo";
import { NavSearch } from "./NavSearch";
import { NotificationNavBtn } from "./NotificationNavBtn";
import { ThemeNavBtn } from "./ThemeNavBtn";
import { UserAvatarBtn } from "./UserAvatarBtn";

export function TopNav() {
  return (
    <Flex
      align="center"
      justify="space-between"
      className="!sticky !top-0 !z-50 !h-16 !w-full !shrink-0 !border-b !px-8"
      style={{
        background: "var(--color-bg-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <Flex align="center" gap={24}>
        <Logo />
        <NavSearch />
      </Flex>
      <Flex align="center" gap={16}>
        <ChatNavBtn />
        <NotificationNavBtn />
        <ThemeNavBtn />
        <UserAvatarBtn />
      </Flex>
    </Flex>
  );
}
