"use client";

import { MessageActionMenu } from "../menu/MessageActionMenu";
import { ReactionPicker } from "../reaction/ReactionPicker";
import type { ReactionKey, ReplyContext } from "../../../../types";

interface MessageActionsProps {
  id: string;
  conversationId: string;
  senderId: string;
  mine: boolean;
  type: "text" | "image" | "file" | "video";
  content: string;
  senderName: string;
  senderSeed?: string;
  myReaction: ReactionKey | null;
  onReply?: (ctx: ReplyContext) => void;
  onStartEdit?: () => void;
  onUnsend?: (id: string) => Promise<void> | void;
  onReact?: (id: string, emoji: ReactionKey | null) => void;
}

/** Hover cluster beside a bubble: reaction picker + the action menu. */
export function MessageActions({
  id,
  conversationId,
  senderId,
  mine,
  type,
  content,
  senderName,
  senderSeed,
  myReaction,
  onReply,
  onStartEdit,
  onUnsend,
  onReact,
}: MessageActionsProps) {
  return (
    <>
      {onReact && (
        <ReactionPicker
          mine={myReaction}
          onPick={(emoji) => onReact(id, emoji)}
          placement={mine ? "topRight" : "topLeft"}
        />
      )}
      <MessageActionMenu
        id={id}
        conversationId={conversationId}
        senderId={senderId}
        mine={mine}
        type={type}
        content={content}
        senderName={senderName}
        senderSeed={senderSeed}
        onReply={onReply}
        onStartEdit={onStartEdit}
        onUnsend={onUnsend}
        placement={mine ? "bottomLeft" : "bottomRight"}
      />
    </>
  );
}
