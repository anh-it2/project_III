"use client";

import { Flex, Typography } from "antd";
import { gradientBg } from "../../data/mock";

const { Text } = Typography;

interface TabItemProps {
  label: string;
  active?: boolean;
}

export function TabItem({ label, active }: TabItemProps) {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        height: 38,
        padding: "0 20px",
        borderRadius: 20,
        background: active ? gradientBg(["#4096ff", "#a855f7"]) : "#1a1a1a",
        border: active ? "0" : "1px solid #2a2a2a",
        cursor: "pointer",
      }}
    >
      <Text
        className="!text-[13px]"
        style={{
          color: active ? "#FFFFFF" : "var(--color-text-muted)",
          fontWeight: active ? 600 : 500,
        }}
      >
        {label}
      </Text>
    </Flex>
  );
}
