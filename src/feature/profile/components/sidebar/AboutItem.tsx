"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../Icon";
import { gradientText, type AboutItem as AboutItemData } from "../../data/mock";

const { Text } = Typography;

interface AboutItemProps {
  item: AboutItemData;
}

export function AboutItem({ item }: AboutItemProps) {
  const iconColor = item.muted ? "#71717a" : undefined;
  const iconStyle = item.gradient && !item.muted
    ? gradientText([...item.gradient], 135)
    : undefined;

  return (
    <Flex align="center" gap={12} className="!w-full">
      <Icon
        name={item.icon}
        size={20}
        color={iconColor}
        style={iconStyle as React.CSSProperties}
      />
      <Text
        className="!text-sm"
        style={{ color: item.muted ? "#71717a" : "#d4d4d8" }}
      >
        {item.text}
      </Text>
    </Flex>
  );
}
