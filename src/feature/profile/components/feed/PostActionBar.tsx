"use client";

import { Flex } from "antd";
import type { ReactionId } from "../../data/mock";
import { CommentButton } from "./CommentButton";
import { LikeButton } from "./reactions/LikeButton";
import { ShareMenu } from "./ShareMenu";

interface PostActionBarProps {
  postId: string;
  reaction: ReactionId | null;
  onReactionChange: (next: ReactionId | null) => void;
  onCommentClick: () => void;
  onShared: () => void;
}

export function PostActionBar({
  postId,
  reaction,
  onReactionChange,
  onCommentClick,
  onShared,
}: PostActionBarProps) {
  return (
    <Flex
      justify="space-around"
      className="!w-full !border-t"
      style={{ padding: "8px 24px", borderColor: "var(--color-border)" }}
    >
      <LikeButton reaction={reaction} onChange={onReactionChange} />
      <CommentButton onClick={onCommentClick} />
      <ShareMenu postId={postId} onShared={onShared} />
    </Flex>
  );
}
