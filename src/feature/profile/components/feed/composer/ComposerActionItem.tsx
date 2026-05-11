"use client";

import { Flex, Typography } from "antd";
import { Icon } from "../../Icon";

const { Text } = Typography;

interface ComposerActionItemProps {
  icon: string;
  label: string;
  iconColor: string;
}

export function ComposerActionItem({
  icon,
  label,
  iconColor,
}: ComposerActionItemProps) {
  return (
    <Flex
      align="center"
      gap={8}
      style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer" }}
    >
      <Icon name={icon} size={20} color={iconColor} />
      <Text className="!text-[13px] !font-medium" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </Text>
    </Flex>
  );
}
