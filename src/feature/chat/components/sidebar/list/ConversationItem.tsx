"use client";

import { Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { buildDmId } from "@/feature/chat/lib/conversation";
import { pickGradient } from "@/feature/chat/lib/avatar";
import { ChatMenu } from "@/feature/chat/components/menu/ChatMenu";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

interface ConversationItemProps {
  user: OnlineUserDto;
  active: boolean;
  online?: boolean;
  unread?: boolean;
  myId: string;
  myName: string;
  onClick: () => void;
}

export function ConversationItem({
  user,
  active,
  online = true,
  unread = false,
  myId,
  myName,
  onClick,
}: ConversationItemProps) {
  const t = useTranslations("Chat.sidebar");
  const lastMessage = unread
    ? t("newMessage")
    : online
      ? t("activeNow")
      : t("offline");
  const conversationId = buildDmId(myId, user.id);

  return (
    <Flex
      align="center"
      gap={8}
      onClick={onClick}
      className={
        "group !w-full !cursor-pointer !rounded-[10px] " +
        (active
          ? "!bg-[var(--color-primary-bg)]"
          : "hover:!bg-[var(--color-bg-tertiary)]")
      }
      style={{ padding: "8px 12px" }}
    >
      <div className="relative shrink-0">
        <Flex
          align="center"
          justify="center"
          className="!rounded-full"
          style={{
            width: 52,
            height: 52,
            background: gradientBg([...pickGradient(user.id)]),
          }}
        >
          <Icon name="person" size={28} color="#FFFFFF" />
        </Flex>
        {online ? (
          <span
            className="absolute"
            style={{
              right: 0,
              bottom: 0,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#22c55e",
              border: "2px solid var(--color-bg-secondary)",
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
            fontWeight: unread ? 700 : active ? 600 : 500,
          }}
        >
          {user.name}
        </Text>
        <Text
          ellipsis
          className="!text-[13px]"
          style={{
            color: unread ? "var(--color-text)" : "var(--color-text-muted)",
            fontWeight: unread ? 600 : 400,
          }}
        >
          {lastMessage}
        </Text>
      </Flex>
      {unread ? (
        <span
          aria-label={t("unreadLabel")}
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
          peerId={user.id}
          peerName={user.name}
          myId={myId}
          myName={myName}
          compact
        />
      </div>
    </Flex>
  );
}
