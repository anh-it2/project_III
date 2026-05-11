"use client";

import { Flex, Typography } from "antd";
import type { StoryCardData } from "../../../data/types";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface StoryCardProps {
  story: StoryCardData;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <div
      className="!relative !h-[186px] !w-[130px] !shrink-0 !cursor-pointer !overflow-hidden !rounded-xl"
      style={{ background: gradientBg(story.bgGradient) }}
    >
      <Flex
        align="center"
        justify="center"
        className="!absolute !h-9 !w-9 !rounded-full"
        style={{
          background: story.avatarColor,
          border: "3px solid #2374e1",
          top: 12,
          left: 12,
        }}
      >
        <Text className="!text-sm !font-bold !leading-none !text-white">
          {story.initial}
        </Text>
      </Flex>
      <Text
        className="!absolute !text-xs !font-semibold !text-white"
        style={{ left: 12, top: 156 }}
      >
        {story.name}
      </Text>
    </div>
  );
}
