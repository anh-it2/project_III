"use client";

import { Flex } from "antd";
import { useState } from "react";
import type { Comment } from "@/shared/data/reactions";
import { CommentSection } from "@/shared/components/post/CommentSection";
import type { Post, ReactionId } from "../../data/mock";
import { PostActionBar } from "./PostActionBar";
import { PostBody } from "./PostBody";
import { PostHeader } from "./PostHeader";
import { PostImage } from "./PostImage";
import { PostReactions } from "./PostReactions";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const initial = post.initialReaction ?? null;
  const [reaction, setReaction] = useState<ReactionId | null>(initial);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [shareCount, setShareCount] = useState(post.shares);

  const likeDelta = (reaction ? 1 : 0) - (initial ? 1 : 0);
  const likeCount = post.likes + likeDelta;
  const commentCount = post.comments + comments.length;

  function handleAddComment(text: string) {
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: "You",
        authorGradient: ["#4096ff", "#a855f7"],
        text,
        time: "Just now",
      },
    ]);
    if (!showComments) setShowComments(true);
  }

  function handleShared() {
    setShareCount((n) => n + 1);
  }

  return (
    <Flex
      vertical
      className="!w-full !overflow-hidden"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 20,
        boxShadow: "0 2px 16px #00000030",
      }}
    >
      <PostHeader post={post} />
      <PostBody text={post.text} hasImage={!!post.image} />
      {post.image ? <PostImage url={post.image} /> : null}
      <PostReactions
        defaultEmojis={post.emojis}
        reaction={reaction}
        likeCount={likeCount}
        commentCount={commentCount}
        shareCount={shareCount}
      />
      <PostActionBar
        postId={post.id}
        reaction={reaction}
        onReactionChange={setReaction}
        onCommentClick={() => setShowComments((v) => !v)}
        onShared={handleShared}
      />
      {showComments ? (
        <CommentSection comments={comments} onAdd={handleAddComment} />
      ) : null}
    </Flex>
  );
}
