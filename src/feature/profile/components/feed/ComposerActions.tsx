"use client";

import { Flex } from "antd";
import { ComposerActionItem } from "./ComposerActionItem";

const ACTIONS = [
  { id: "live", icon: "videocam", label: "Live Video", color: "#ef4444" },
  { id: "media", icon: "photo_library", label: "Photo/Video", color: "#22c55e" },
  { id: "feeling", icon: "mood", label: "Feeling/Activity", color: "#f59e0b" },
];

export function ComposerActions() {
  return (
    <Flex justify="space-around" className="!w-full">
      {ACTIONS.map((a) => (
        <ComposerActionItem
          key={a.id}
          icon={a.icon}
          label={a.label}
          iconColor={a.color}
        />
      ))}
    </Flex>
  );
}
