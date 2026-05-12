"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { buildDmId } from "../../lib/conversation";
import { useConversationSettingsStore } from "../../stores/conversation-settings.store";
import { MediaFilesLinks } from "./media-files-links";
import { PrivacyActions } from "./PrivacyActions";
import { ProfileSection } from "./ProfileSection";
import { QuickActions } from "./QuickActions";

const { Text } = Typography;

interface ChatRightPanelProps {
  user: OnlineUserDto | null;
}

export function ChatRightPanel({ user }: ChatRightPanelProps) {
  const t = useTranslations("Chat.right");
  const myId = useAuthStore((s) => s.userId);
  const conversationId = user ? buildDmId(myId, user.id) : "";
  const peerNickname = useConversationSettingsStore((s) =>
    user ? s.settings[conversationId]?.nicknames?.[user.id] : undefined,
  );
  const isOnline = usePresenceStore((s) =>
    user ? s.onlineUsers.some((u) => u.id === user.id) : false,
  );

  if (!user) {
    return (
      <aside className="flex h-full w-[340px] shrink-0 items-center justify-center border-l border-[var(--color-border)] bg-white px-6 dark:bg-[#141414]">
        <Text className="!text-center !text-[13px] !text-[var(--color-text-muted)]">
          {t("empty")}
        </Text>
      </aside>
    );
  }

  const displayName = peerNickname ?? user.name;

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col overflow-y-auto border-l border-[var(--color-border)] bg-white pr-3 dark:bg-[#141414]">
      <ProfileSection
        user={user}
        displayName={displayName}
        isOnline={isOnline}
      />
      <div className="h-3" />
      <QuickActions />
      <div className="h-3" />
      <MediaFilesLinks conversationId={conversationId} />
      <div className="h-3" />
      <PrivacyActions recipientName={displayName} />
    </aside>
  );
}
