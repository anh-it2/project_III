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
      className="!sticky !top-0 !z-50 !h-16 !w-full !shrink-0 !border-b !px-3 sm:!px-4 lg:!px-8"
      style={{
        background: "var(--color-bg-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      <Flex align="center" className="!min-w-0 !gap-3 sm:!gap-4 lg:!gap-6">
        <Logo />
        <NavSearch />
      </Flex>
      <Flex align="center" className="!gap-2 sm:!gap-3 lg:!gap-4">
        <ChatNavBtn />
        <NotificationNavBtn />
        <ThemeNavBtn />
        <UserAvatarBtn />
      </Flex>
    </Flex>
  );
}
