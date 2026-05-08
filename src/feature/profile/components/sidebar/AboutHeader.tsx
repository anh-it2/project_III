"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../Icon";

const { Text } = Typography;

export function AboutHeader() {
  return (
    <Flex align="center" justify="space-between" className="!w-full">
      <Text
        className="!text-[17px] !font-bold !leading-tight"
        style={{ color: "var(--color-text)" }}
      >
        About
      </Text>
      <Icon name="edit" size={18} color="var(--color-text-muted)" />
    </Flex>
  );
}
