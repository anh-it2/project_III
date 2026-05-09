"use client";

import { Flex } from "antd";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { RECENT_CHATS, type ChatPreview } from "@/shared/data/chats";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { ChatDropdownFooter } from "./ChatDropdownFooter";
import { ChatDropdownHeader } from "./ChatDropdownHeader";
import { ChatDropdownItem } from "./ChatDropdownItem";

interface ChatDropdownContentProps {
  onClose: () => void;
}

export function ChatDropdownContent({ onClose }: ChatDropdownContentProps) {
  const nav = useNavigation();
  const openChat = useChatBoxesStore((s) => s.openChat);

  function handleItemClick(chat: ChatPreview) {
    openChat(chat);
    onClose();
  }

  function goSeeAll() {
    nav.push("/chat");
    onClose();
  }

  return (
    <Flex
      vertical
      className="!w-[360px]"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      <ChatDropdownHeader />
      <Flex
        vertical
        gap={2}
        className="!w-full"
        style={{
          padding: "4px 8px 8px 8px",
          maxHeight: 420,
          overflowY: "auto",
        }}
      >
        {RECENT_CHATS.map((c) => (
          <ChatDropdownItem
            key={c.id}
            chat={c}
            onClick={() => handleItemClick(c)}
          />
        ))}
      </Flex>
      <ChatDropdownFooter onSeeAll={goSeeAll} />
    </Flex>
  );
}
