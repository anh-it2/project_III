"use client";

import { Flex } from "antd";
import { Icon } from "@/shared/components/Icon";
import { gradientBg } from "@/shared/utils/gradient";

interface PostImageProps {
  gradient: [string, string, string];
}

export function PostImage({ gradient }: PostImageProps) {
  return (
    <Flex
      align="center"
      justify="center"
      className="!w-full"
      style={{ height: 260, background: gradientBg(gradient) }}
    >
      <Icon name="image" size={56} color="#ffffff80" />
    </Flex>
  );
}
