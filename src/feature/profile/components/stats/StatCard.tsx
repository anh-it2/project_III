"use client";

import { Flex, Typography } from "antd";
import { gradientText, type StatItem } from "../../data/mock";

const { Text } = Typography;

interface StatCardProps {
  item: StatItem;
}

export function StatCard({ item }: StatCardProps) {
  return (
    <Flex
      vertical
      align="center"
      gap={2}
      className="!flex-1"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
        padding: "16px 24px",
      }}
    >
      <Text
        className="!text-[24px] !font-extrabold !leading-tight"
        style={{
          fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
          ...gradientText([...item.gradient], 135),
        }}
      >
        {item.value}
      </Text>
      <Text
        className="!text-xs !font-medium"
        style={{ color: "var(--color-text-muted)", letterSpacing: 0.5 }}
      >
        {item.label}
      </Text>
    </Flex>
  );
}
