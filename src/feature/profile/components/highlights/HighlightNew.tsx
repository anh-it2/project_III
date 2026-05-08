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
          background: "var(--color-bg-tertiary)",
          border: "2px dashed #3f3f46",
        }}
      >
        <Icon name="add" size={32} color="var(--color-text-muted)" />
      </Flex>
      <Text className="!text-xs !font-medium" style={{ color: "var(--color-text-muted)" }}>
        New
      </Text>
    </Flex>
  );
}
