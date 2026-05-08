"use client";

import { Button, Flex, Typography } from "antd";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { Avatar } from "../Avatar";

const { Text } = Typography;

interface ConversationItemProps {
  user: OnlineUserDto;
  active: boolean;
  onClick: () => void;
}

export function ConversationItem({
  user,
  active,
  onClick,
}: ConversationItemProps) {
  const baseCls =
    "!h-[72px] !w-full !rounded-xl !px-3 !text-left !justify-start !border-0 !shadow-none";
  const stateCls = active
    ? "!bg-[#e6f4ff] dark:!bg-[#1c2942]"
    : "!bg-transparent hover:!bg-[#f0f2f5] dark:hover:!bg-[#1f1f1f]";

  return (
    <Button
      type="text"
      onClick={onClick}
      className={baseCls + " " + stateCls}
    >
      <Flex align="center" gap={12} className="h-full w-full">
        <Avatar name={user.name} seed={user.id} size={52} online />
        <Flex vertical gap={4} className="min-w-0 flex-1">
          <Text
            ellipsis
            strong={active}
            className="!text-[15px] !text-[var(--color-text)]"
          >
            {user.name}
          </Text>
          <Text
            ellipsis
            className="!text-[13px] !text-[var(--color-text-muted)]"
          >
            Tap to start chatting
          </Text>
        </Flex>
      </Flex>
    </Button>
  );
}
