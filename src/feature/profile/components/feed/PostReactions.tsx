"use client";

import { Flex, Typography } from "antd";
import { formatCount, REACTION_BY_ID, type ReactionId } from "../../data/mock";

const { Text } = Typography;

interface PostReactionsProps {
  defaultEmojis: string;
  reaction: ReactionId | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
}

function emojiDisplay(reaction: ReactionId | null, fallback: string): string {
  if (!reaction) return fallback;
  const emoji = REACTION_BY_ID[reaction].emoji;
  const rest = fallback.split(" ").filter((e) => e !== emoji).slice(0, 2);
  return [emoji, ...rest].join(" ");
}

export function PostReactions({
  defaultEmojis,
  reaction,
  likeCount,
  commentCount,
  shareCount,
}: PostReactionsProps) {
  return (
    <Flex
      align="center"
      justify="space-between"
      className="!w-full !border-t"
      style={{ padding: "12px 24px", borderColor: "#1e1e2e" }}
    >
      <Flex align="center" gap={8}>
        <Text className="!text-base" style={{ color: "#f0f0f0" }}>
          {emojiDisplay(reaction, defaultEmojis)}
        </Text>
        <Text className="!text-[13px]" style={{ color: "#a1a1aa" }}>
          {formatCount(likeCount)}
        </Text>
      </Flex>
      <Flex align="center" gap={16}>
        <Text className="!text-[13px]" style={{ color: "#a1a1aa" }}>
          {formatCount(commentCount)} comments
        </Text>
        <Text className="!text-[13px]" style={{ color: "#a1a1aa" }}>
          {formatCount(shareCount)} shares
        </Text>
      </Flex>
    </Flex>
  );
}
