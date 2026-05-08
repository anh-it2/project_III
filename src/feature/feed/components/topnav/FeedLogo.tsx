"use client";

import { Flex, Typography } from "antd";

const { Text } = Typography;

export function FeedLogo() {
  return (
    <Flex
      align="center"
      justify="center"
      className="!h-10 !w-10 !shrink-0 !rounded-full"
      style={{ background: "#2374e1" }}
    >
      <Text className="!text-[28px] !font-black !leading-none !text-white">
        f
      </Text>
    </Flex>
  );
}
