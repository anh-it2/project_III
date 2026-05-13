"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";
import { MediaFilesLinks } from "./media-files-links";
import { GroupActionsPanel } from "./GroupActionsPanel";
import { GroupMembersList } from "./group-members/GroupMembersList";
import { useChatStore } from "../../stores/chat.store";

const { Text } = Typography;

interface GroupRightPanelProps {
  conversationId: string;
  myId: string;
}

export function GroupRightPanel({ conversationId, myId }: GroupRightPanelProps) {
  const t = useTranslations("Chat.right");
  const group = useChatStore((s) => s.groups[conversationId]);

  if (!group) {
    return (
      <aside className="flex h-full w-[340px] shrink-0 items-center justify-center border-l border-[var(--color-border)] bg-white px-6 dark:bg-[#141414]">
        <Text className="!text-center !text-[13px] !text-[var(--color-text-muted)]">
          {t("empty")}
        </Text>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-[340px] shrink-0 flex-col overflow-y-auto border-l border-[var(--color-border)] bg-white px-5 py-6 dark:bg-[#141414]">
      <Text className="!text-[18px] !font-semibold !text-[var(--color-text)]">
        {group.name}
      </Text>
      <Text className="!mt-1 !text-[13px] !text-[var(--color-text-muted)]">
        {t("memberCount", { count: group.memberIds.length })}
      </Text>
      <div className="h-3" />
      <GroupMembersList group={group} myId={myId} />
      <div className="h-4" />
      <GroupActionsPanel group={group} myId={myId} />
      <div className="h-4" />
      <MediaFilesLinks conversationId={conversationId} />
    </aside>
  );
}
