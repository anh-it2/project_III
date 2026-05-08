"use client";

import { Flex, Typography } from "antd";

const { Text } = Typography;

export function ComposerInput() {
  return (
    <Flex
      align="center"
      className="!flex-1"
      style={{
        height: 44,
        background: "#1f1f1f",
        borderRadius: 22,
        padding: "0 20px",
      }}
    >
      <Text className="!text-sm" style={{ color: "#71717a" }}>
        What&apos;s on your mind, Sarah?
      </Text>
    </Flex>
  );
}
