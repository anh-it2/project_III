"use client";

import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { ChatBox } from "./ChatBox";

export function ChatBoxes() {
  const openChats = useChatBoxesStore((s) => s.openChats);

  if (openChats.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 344,
        display: "flex",
        gap: 12,
        alignItems: "flex-end",
        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      {openChats.map((chat) => (
        <div key={chat.id} style={{ pointerEvents: "auto" }}>
          <ChatBox chat={chat} />
        </div>
      ))}
    </div>
  );
}
