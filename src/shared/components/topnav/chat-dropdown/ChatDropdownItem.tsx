"use client";

import { Flex, Typography } from "antd";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { ChatMenu } from "@/feature/chat/components/menu/ChatMenu";
import { buildDmId } from "@/feature/chat/lib/conversation";
import { Icon } from "@/shared/components/Icon";
import type { ChatPreview } from "@/shared/data/chats";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface ChatDropdownItemProps {
  chat: ChatPreview;
  onClick: () => void;
  isGroup?: boolean;
}

export function ChatDropdownItem({
  chat,
  onClick,
  isGroup = false,
}: ChatDropdownItemProps) {
  const myId = useAuthStore((s) => s.userId);
  const myName = useAuthStore((s) => s.userName);
  const conversationId = isGroup ? chat.id : buildDmId(myId, chat.id);

  return (
    <Flex
      align="center"
      gap={12}
      onClick={onClick}
      className="group !w-full !cursor-pointer !rounded-[10px] !px-3 !py-2 !transition-colors hover:!bg-[var(--color-bg-tertiary)]"
    >
      <div className="relative shrink-0">
        <Flex
          align="center"
          justify="center"
          className="!rounded-full"
          style={{
            width: 52,
            height: 52,
            background: gradientBg([...chat.gradient]),
          }}
        >
          <Icon name={isGroup ? "group" : "person"} size={28} color="#FFFFFF" />
        </Flex>
        {!isGroup && chat.online ? (
          <span
            className="absolute"
            style={{
              right: 0,
              bottom: 0,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid #1a1a1a",
            }}
          />
        ) : null}
      </div>
      <Flex vertical gap={2} className="!min-w-0 !flex-1">
        <Text
          ellipsis
          className="!text-sm"
          style={{
            color: "var(--color-text)",
            fontWeight: chat.unread ? 700 : 500,
          }}
        >
          {chat.name}
        </Text>
        <Flex align="center" gap={6}>
          <Text
            ellipsis
            className="!text-[13px] !flex-1"
            style={{
              color: chat.unread ? "var(--color-text)" : "var(--color-text-muted)",
              fontWeight: chat.unread ? 600 : 400,
            }}
          >
            {chat.lastMessage}
          </Text>
          <Text className="!text-[12px]" style={{ color: "var(--color-text-muted)" }}>
            · {chat.time}
          </Text>
        </Flex>
      </Flex>
      {chat.unread ? (
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#4096ff",
            flexShrink: 0,
          }}
        />
      ) : null}
      <div
        className="!shrink-0 !opacity-0 transition-opacity group-hover:!opacity-100 focus-within:!opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <ChatMenu
          conversationId={conversationId}
          peerId={chat.id}
          peerName={chat.name}
          myId={myId}
          myName={myName}
          compact
          isGroup={isGroup}
        />
      </div>
    </Flex>
  );
}
