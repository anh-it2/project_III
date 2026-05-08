"use client";

import { Flex } from "antd";
import { Icon } from "../Icon";
import { gradientBg } from "../../data/mock";

export function ProfileAvatar() {
  return (
    <Flex
      align="center"
      justify="center"
      className="!rounded-full"
      style={{
        width: 144,
        height: 144,
        background: gradientBg(["#4096ff", "#a855f7", "#ec4899"]),
        boxShadow: "0 4px 24px #a855f740",
      }}
    >
      <Flex
        align="center"
        justify="center"
        className="!rounded-full"
        style={{
          width: 136,
          height: 136,
          background: "var(--color-bg-secondary)",
          border: "4px solid var(--color-bg)",
        }}
      >
        <Icon name="person" size={64} color="var(--color-text-muted)" />
      </Flex>
    </Flex>
  );
}
