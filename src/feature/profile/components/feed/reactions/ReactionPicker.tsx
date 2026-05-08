"use client";

import { Flex } from "antd";
import { REACTIONS, type ReactionId } from "../../../data/mock";
import { ReactionItem } from "./ReactionItem";

interface ReactionPickerProps {
  onPick: (id: ReactionId) => void;
}

export function ReactionPicker({ onPick }: ReactionPickerProps) {
  return (
    <Flex
      align="center"
      gap={4}
      className="!rounded-full"
      style={{
        background: "var(--color-bg-tertiary)",
        border: "1px solid #2e2e2e",
        padding: "6px 8px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      {REACTIONS.map((r) => (
        <ReactionItem key={r.id} reaction={r} onPick={() => onPick(r.id)} />
      ))}
    </Flex>
  );
}
