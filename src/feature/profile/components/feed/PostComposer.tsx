"use client";

import { Flex } from "antd";
import { ComposerActions } from "./ComposerActions";
import { ComposerDivider } from "./ComposerDivider";
import { ComposerInput } from "./ComposerInput";
import { PostAvatar } from "./PostAvatar";

export function PostComposer() {
  return (
    <Flex
      vertical
      gap={16}
      className="!w-full"
      style={{
        background: "#111114",
        border: "1px solid #1e1e2e",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 2px 16px #00000030",
      }}
    >
      <Flex gap={12} className="!w-full">
        <PostAvatar size={44} gradient={["#4096ff", "#a855f7"]} />
        <ComposerInput />
      </Flex>
      <ComposerDivider />
      <ComposerActions />
    </Flex>
  );
}
