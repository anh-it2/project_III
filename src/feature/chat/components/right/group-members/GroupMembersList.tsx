"use client";

import { App, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Icon } from "@/shared/components/Icon";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { useGroupActions } from "../../../hooks/useGroupActions";
import type { GroupInfo } from "../../../stores/chat.store.type";
import { GroupMemberRow } from "./GroupMemberRow";
import {
  buildMemberMenuItems,
  buildMemberRows,
} from "./groupMembers.utils";

const { Text } = Typography;

interface GroupMembersListProps {
  group: GroupInfo;
  myId: string;
}

export function GroupMembersList({ group, myId }: GroupMembersListProps) {
  const t = useTranslations("GroupAdmin.members");
  const { message } = App.useApp();
  const knownUsers = usePresenceStore((s) => s.knownUsers);
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const onlineIds = useMemo(
    () => new Set(onlineUsers.map((u) => u.id)),
    [onlineUsers],
  );
  const { kick, promote, muteMember, blockMember } = useGroupActions(
    group.conversationId,
  );

  const iAmAdmin = group.adminIds.includes(myId);

  function nameOf(id: string) {
    return knownUsers.find((u) => u.id === id)?.name ?? id;
  }

  async function run(
    successLabel: string,
    fn: () => Promise<{ ok: boolean; error?: string }>,
  ) {
    const ack = await fn();
    if (ack.ok) message.success(successLabel);
    else message.error(ack.error ?? t("actionFailed"));
  }

  const labels = {
    promote: t("promote"),
    mute: t("mute"),
    unmute: t("unmute"),
    block: t("block"),
    unblock: t("unblock"),
    kick: t("kick"),
  };

  const handlers = {
    onPromote: (id: string) => run(t("promoted"), () => promote(id)),
    onToggleMute: (id: string, on: boolean) =>
      run(on ? t("muted") : t("unmuted"), () => muteMember(id, on)),
    onToggleBlock: (id: string, on: boolean) =>
      run(on ? t("blocked") : t("unblocked"), () => blockMember(id, on)),
    onKick: (id: string) => run(t("kicked"), () => kick(id)),
  };

  const iconRenderer = (name: string, danger?: boolean) => (
    <Icon
      name={name}
      size={16}
      color={danger ? "var(--color-error)" : "var(--color-text)"}
    />
  );

  const rows = buildMemberRows(group, myId, nameOf, onlineIds);
  const rowLabels = {
    you: t("you"),
    adminBadge: t("adminBadge"),
    mutedTag: t("mutedTag"),
    blockedTag: t("blockedTag"),
  };

  return (
    <Flex vertical gap={6}>
      <Text className="!text-[13px] !font-semibold !text-[var(--color-text)]">
        {t("title", { count: group.memberIds.length })}
      </Text>
      {rows.map((row) => (
        <GroupMemberRow
          key={row.memberId}
          row={row}
          menuItems={buildMemberMenuItems(
            row,
            iAmAdmin,
            labels,
            handlers,
            iconRenderer,
          )}
          labels={rowLabels}
        />
      ))}
    </Flex>
  );
}
