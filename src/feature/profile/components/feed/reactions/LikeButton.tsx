"use client";

import { Button, Popover, Typography } from "antd";
import { useState } from "react";
import { Icon } from "../../Icon";
import {
  REACTION_BY_ID,
  type ReactionId,
} from "../../../data/mock";
import { ReactionPicker } from "./ReactionPicker";

const { Text } = Typography;

interface LikeButtonProps {
  reaction: ReactionId | null;
  onChange: (next: ReactionId | null) => void;
}

export function LikeButton({ reaction, onChange }: LikeButtonProps) {
  const [open, setOpen] = useState(false);
  const active = reaction !== null;
  const current = reaction ? REACTION_BY_ID[reaction] : null;
  const color = current?.color ?? "#a1a1aa";
  const label = current?.label ?? "Like";

  function handleClick() {
    onChange(reaction ? null : "like");
  }

  function handlePick(id: ReactionId) {
    onChange(id);
    setOpen(false);
  }

  return (
    <Popover
      content={<ReactionPicker onPick={handlePick} />}
      trigger="hover"
      open={open}
      onOpenChange={setOpen}
      placement="top"
      mouseEnterDelay={0.4}
      mouseLeaveDelay={0.2}
      styles={{
        container: {
          padding: 0,
          background: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <Button
        type="text"
        onClick={handleClick}
        className="!flex !h-auto !items-center !gap-2 !rounded-lg !px-4 !py-2.5"
      >
        {current ? (
          <span style={{ fontSize: 20, lineHeight: 1 }}>{current.emoji}</span>
        ) : (
          <Icon name="thumb_up" size={20} color={color} />
        )}
        <Text
          className="!text-sm"
          style={{ color, fontWeight: active ? 600 : 500 }}
        >
          {label}
        </Text>
      </Button>
    </Popover>
  );
}
