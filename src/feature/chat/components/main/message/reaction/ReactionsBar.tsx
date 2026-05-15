"use client";

import { Button, Flex } from "antd";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { groupReactions, reactionEmoji } from "../../../../lib/reactions";
import type { MessageReaction, ReactionKey } from "../../../../types";

interface ReactionsBarProps {
  reactions?: MessageReaction[];
  mine: boolean;
  /** toggle the current user's reaction to this emoji (null clears) */
  onToggle: (emoji: ReactionKey | null) => void;
}

export function ReactionsBar({ reactions, mine, onToggle }: ReactionsBarProps) {
  const myId = useAuthStore((s) => s.userId);
  const { groups } = groupReactions(reactions, myId);
  if (groups.length === 0) return null;

  return (
    <Flex
      gap={4}
      wrap
      className={`!mt-1 ${mine ? "!justify-end" : "!justify-start"}`}
    >
      {groups.map((g) => (
        <Button
          key={g.emoji}
          type="text"
          size="small"
          onClick={() => onToggle(g.mine ? null : g.emoji)}
          className="!flex !h-6 !items-center !gap-1 !rounded-full !px-2 !text-[12px]"
          style={{
            background: g.mine
              ? "var(--color-primary-bg)"
              : "var(--color-bg-tertiary)",
            border: g.mine
              ? "1px solid var(--color-primary)"
              : "1px solid var(--color-border)",
            color: g.mine
              ? "var(--color-primary)"
              : "var(--color-text-secondary)",
          }}
        >
          <span className="text-[13px] leading-none">
            {reactionEmoji(g.emoji)}
          </span>
          <span className="leading-none">{g.count}</span>
        </Button>
      ))}
    </Flex>
  );
}
