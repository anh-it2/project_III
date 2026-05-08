"use client";

import { Flex, Typography } from "antd";
import { gradientBg } from "../../data/mock";

const { Text } = Typography;

export function Logo() {
  return (
    <Flex align="center" gap={24}>
      <Flex
        align="center"
        justify="center"
        className="!h-10 !w-10 !rounded-xl"
        style={{ background: gradientBg(["#4096ff", "#a855f7"]) }}
      >
        <Text className="!text-[24px] !font-extrabold !leading-none !text-white">
          f
        </Text>
      </Flex>
      <Text className="!text-[22px] !font-bold" style={{ color: "#f0f0f0" }}>
        facebook
      </Text>
    </Flex>
  );
}
