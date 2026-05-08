"use client";

import { Flex } from "antd";
import type { Comment } from "../../../data/mock";
import { CommentInput } from "./CommentInput";
import { CommentList } from "./CommentList";

interface CommentSectionProps {
  comments: Comment[];
  onAdd: (text: string) => void;
}

export function CommentSection({ comments, onAdd }: CommentSectionProps) {
  return (
    <Flex
      vertical
      gap={16}
      className="!w-full !border-t"
      style={{ padding: "16px 24px", borderColor: "#1e1e2e" }}
    >
      <CommentList comments={comments} />
      <CommentInput onSubmit={onAdd} />
    </Flex>
  );
}
