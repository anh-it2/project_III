"use client";

import { Flex, Typography } from "antd";
import type { Comment } from "../../../data/mock";
import { PostAvatar } from "../PostAvatar";

const { Text } = Typography;

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  return (
    <Flex gap={8} className="!w-full">
      <PostAvatar
        size={32}
        gradient={comment.authorGradient}
        iconColor={comment.authorGradient ? "#FFFFFF" : "#71717a"}
      />
      <Flex vertical gap={4} className="!flex-1">
        <Flex
          vertical
          gap={2}
          style={{
            background: "#1f1f1f",
            borderRadius: 16,
            padding: "8px 12px",
            maxWidth: "fit-content",
          }}
        >
          <Text className="!text-[13px] !font-semibold" style={{ color: "#f0f0f0" }}>
            {comment.author}
          </Text>
          <Text className="!text-sm" style={{ color: "#d4d4d8" }}>
            {comment.text}
          </Text>
        </Flex>
        <Flex gap={12} style={{ paddingLeft: 12 }}>
          <Text className="!text-[11px] !font-semibold" style={{ color: "#71717a", cursor: "pointer" }}>
            Like
          </Text>
          <Text className="!text-[11px] !font-semibold" style={{ color: "#71717a", cursor: "pointer" }}>
            Reply
          </Text>
          <Text className="!text-[11px]" style={{ color: "#71717a" }}>
            {comment.time}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
