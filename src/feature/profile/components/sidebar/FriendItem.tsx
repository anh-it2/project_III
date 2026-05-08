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
          background: "#1f1f1f",
          borderRadius: 12,
        }}
      >
        <Icon name="person" size={36} color="#71717a" />
      </Flex>
      <Text className="!text-xs !font-medium" style={{ color: "#d4d4d8" }}>
        {friend.name}
      </Text>
    </Flex>
  );
}
