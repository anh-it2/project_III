"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../Icon";
import { gradientText } from "../../data/mock";

const { Text } = Typography;

export function AboutHeader() {
  return (
    <Flex align="center" justify="space-between" className="!w-full">
      <Text
        className="!text-[17px] !font-bold !leading-tight"
        style={gradientText(["#f0f0f0", "#a1a1aa"], 90)}
      >
        About
      </Text>
      <Icon name="edit" size={18} color="#71717a" />
    </Flex>
  );
}
