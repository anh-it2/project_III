"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../Icon";
import type { Friend } from "../../data/mock";

const { Text } = Typography;

interface FriendItemProps {
  friend: Friend;
}

export function FriendItem({ friend }: FriendItemProps) {
  return (
    <Flex vertical align="center" gap={8} className="!flex-1">
      <Flex
        align="center"
        justify="center"
        className="!w-full"
        style={{
          height: 96,
          background: "var(--color-bg-tertiary)",
          borderRadius: 12,
        }}
      >
        <Icon name="person" size={36} color="var(--color-text-muted)" />
      </Flex>
      <Text className="!text-xs !font-medium" style={{ color: "var(--color-text-secondary)" }}>
        {friend.name}
      </Text>
    </Flex>
  );
}
