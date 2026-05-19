"use client";

import { Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "@/shared/components/Icon";
import { pickGradient } from "@/feature/chat/lib/avatar";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { useChatBoxesStore } from "@/shared/stores/chatBoxes.store";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import { useProfileView } from "../../../context/ProfileViewContext";
import { COVER_GLASS_PRIMARY, COVER_GLASS_FG } from "./coverGlass";

const { Text } = Typography;

// Frosted-glass pill matching the cover chips ("Open to collab"); the
// brand-tinted primary variant marks this as the primary action. Same
// pill geometry as the rest of the cover row so it reads as one group.
const pillPrimary =
  `${COVER_GLASS_PRIMARY} ` +
  "!h-9 !rounded-3xl !px-4 md:!h-10 md:!px-6";

/**
 * Primary action when viewing another person's profile: open a DM chat box
 * with them. Mirrors the chat dropdown's "click a person" path exactly
 * (clone-chat §6): markRead → openChat, online derived from /presence,
 * avatar gradient via pickGradient. The chatBoxes store keys a DM by the
 * peer's user id, so the existing socket DM room delivery just works.
 */
export function MessageButton() {
  const t = useTranslations("Profile.actions");
  const view = useProfileView();
  const openChat = useChatBoxesStore((s) => s.openChat);
  const markRead = useChatRoomUnreadStore((s) => s.markRead);
  const isOnline = usePresenceStore((s) =>
    view.personId ? s.onlineUsers.some((u) => u.id === view.personId) : false,
  );

  if (view.isSelf || !view.personId) return null;

  const peerId = view.personId;

  function handleClick() {
    markRead(peerId);
    openChat({
      id: peerId,
      name: view.name ?? peerId,
      lastMessage: "",
      time: "",
      online: isOnline,
      gradient: pickGradient(peerId),
    });
  }

  return (
    <Button type="text" onClick={handleClick} className={pillPrimary}>
      <Flex align="center" gap={8}>
        <Icon name="chat_bubble" size={18} color={COVER_GLASS_FG} />
        <Text className="!text-sm !font-semibold !text-[var(--cover-glass-fg)]">
          {t("message")}
        </Text>
      </Flex>
    </Button>
  );
}
