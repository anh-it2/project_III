"use client";

import { Flex } from "antd";
import { extractFirstInternalPostId } from "../../../../lib/messageLinks";
import { MessageImage } from "./MessageImage";
import { MessageText } from "./MessageText";
import { PostLinkPreview } from "./PostLinkPreview";

const TEXT_PADDING = "px-4 py-3";

interface MessageBodyProps {
  content: string;
  isImage: boolean;
  mine: boolean;
  hasReply: boolean;
  themeGradient?: [string, string];
  themeOnPrimary?: string;
}

export function MessageBody({
  content,
  isImage,
  mine,
  hasReply,
  themeGradient,
  themeOnPrimary,
}: MessageBodyProps) {
  const bubbleRadius = {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...(mine
      ? {
          borderBottomRightRadius: 6,
          ...(hasReply ? { borderTopRightRadius: 4 } : {}),
        }
      : {
          borderBottomLeftRadius: 6,
          ...(hasReply ? { borderTopLeftRadius: 4 } : {}),
        }),
  } as const;

  if (isImage) {
    return (
      <div
        className="overflow-hidden"
        style={{ ...bubbleRadius, position: "relative" }}
      >
        <MessageImage src={content} />
      </div>
    );
  }

  const sharedPostId = extractFirstInternalPostId(content);

  return (
    <Flex vertical gap={6} className="!w-full">
      <div
        className={TEXT_PADDING + (mine ? " shadow-sm" : " border")}
        style={
          mine
            ? {
                ...bubbleRadius,
                background: themeGradient
                  ? `linear-gradient(90deg, ${themeGradient[0]}, ${themeGradient[1]})`
                  : "linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))",
                color: themeOnPrimary ?? "var(--color-on-primary)",
                position: "relative",
              }
            : {
                ...bubbleRadius,
                background: "var(--color-bg-secondary)",
                borderColor: "var(--color-border)",
                position: "relative",
              }
        }
      >
        <MessageText content={content} mine={mine} />
      </div>
      {sharedPostId ? <PostLinkPreview postId={sharedPostId} /> : null}
    </Flex>
  );
}
