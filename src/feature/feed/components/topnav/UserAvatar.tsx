"use client";

import { Flex, Typography } from "antd";
import { CURRENT_USER } from "../../data/constants";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

export function UserAvatar() {
  return (
    <Flex
      align="center"
      justify="center"
      className="!h-10 !w-10 !shrink-0 !cursor-pointer !rounded-full"
      style={{ background: gradientBg(CURRENT_USER.gradient) }}
    >
      <Text className="!text-base !font-bold !leading-none !text-white">
        {CURRENT_USER.initial}
      </Text>
    </Flex>
  );
}
