"use client";

import { Flex, Typography } from "antd";
import { SPONSORED } from "../../data/constants";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

export function SponsoredSection() {
  return (
    <Flex vertical gap={12} className="!w-full">
      <Text className="!text-base !font-semibold" style={{ color: "#b0b3b8" }}>
        Sponsored
      </Text>
      <Flex gap={10} className="!w-full !cursor-pointer !rounded-lg !p-1">
        <div
          className="!h-[110px] !w-[110px] !shrink-0 !rounded-lg"
          style={{ background: gradientBg(SPONSORED.thumbGradient) }}
        />
        <Flex vertical gap={4} className="!flex-1">
          <Text
            className="!text-[15px] !font-semibold"
            style={{ color: "#e4e6eb" }}
          >
            {SPONSORED.title}
          </Text>
          <Text className="!text-[13px]" style={{ color: "#b0b3b8" }}>
            {SPONSORED.subtitle}
          </Text>
          <Text className="!text-xs" style={{ color: "#b0b3b8" }}>
            {SPONSORED.url}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
