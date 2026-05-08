"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../Icon";

const { Text } = Typography;

export function HighlightNew() {
  return (
    <Flex vertical align="center" gap={8}>
      <Flex
        align="center"
        justify="center"
        className="!rounded-full"
        style={{
          width: 76,
          height: 76,
          background: "#1f1f1f",
          border: "2px dashed #3f3f46",
        }}
      >
        <Icon name="add" size={32} color="#71717a" />
      </Flex>
      <Text className="!text-xs !font-medium" style={{ color: "#71717a" }}>
        New
      </Text>
    </Flex>
  );
}
