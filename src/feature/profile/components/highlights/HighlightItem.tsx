"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../Icon";
import { gradientBg, type Highlight } from "../../data/mock";

const { Text } = Typography;

interface HighlightItemProps {
  item: Highlight;
}

export function HighlightItem({ item }: HighlightItemProps) {
  return (
    <Flex vertical align="center" gap={8}>
      <Flex
        align="center"
        justify="center"
        className="!rounded-full"
        style={{
          width: 76,
          height: 76,
          background: gradientBg([...item.gradient]),
        }}
      >
        <Flex
          align="center"
          justify="center"
          className="!rounded-full"
          style={{
            width: 70,
            height: 70,
            background: "var(--color-bg-tertiary)",
            border: "3px solid var(--color-bg)",
          }}
        >
          <Icon name={item.icon} size={28} color="var(--color-text-muted)" />
        </Flex>
      </Flex>
      <Text className="!text-xs !font-medium" style={{ color: "var(--color-text-muted)" }}>
        {item.label}
      </Text>
    </Flex>
  );
}
