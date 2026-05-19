"use client";

import { Flex, Typography } from "antd";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";
import styles from "./ShareDropdown.module.scss";

const { Text } = Typography;

interface ShareDropdownItemProps {
  icon: string;
  gradient: [string, string];
  title: string;
  description: string;
  onClick: () => void;
}

export function ShareDropdownItem({
  icon,
  gradient,
  title,
  description,
  onClick,
}: ShareDropdownItemProps) {
  return (
    <Flex
      align="center"
      gap={12}
      onClick={onClick}
      className={`${styles.row} !w-full [padding:8px_10px] rounded-[12px] [cursor:pointer]`}  >
      <Flex
        align="center"
        justify="center"
        className="!rounded-full !shrink-0"
        style={{
          width: 36,
          height: 36,
          background: gradientBg([...gradient]),
        }}
      >
        <Icon name={icon} size={20} color="#FFFFFF" />
      </Flex>
      <Flex vertical gap={2} className="!min-w-0 !flex-1">
        <Text
          className="!text-[15px] !font-semibold text-[var(--color-text)]"  >
          {title}
        </Text>
        <Text
          className="!text-[13px] text-[var(--color-text-muted)]"  >
          {description}
        </Text>
      </Flex>
    </Flex>
  );
}
