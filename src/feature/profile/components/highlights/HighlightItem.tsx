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
            background: "#1f1f1f",
            border: "3px solid #0a0a0a",
          }}
        >
          <Icon name={item.icon} size={28} color="#a1a1aa" />
        </Flex>
      </Flex>
      <Text className="!text-xs !font-medium" style={{ color: "#a1a1aa" }}>
        {item.label}
      </Text>
    </Flex>
  );
}
