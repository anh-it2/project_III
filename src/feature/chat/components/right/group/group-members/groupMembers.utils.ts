import type { MenuProps } from "antd";
import type { GroupInfo } from "../../../../stores/chat.store.type";

export interface MemberRowState {
  memberId: string;
  name: string;
  isMe: boolean;
  isAdmin: boolean;
  isMuted: boolean;
  isBlocked: boolean;
  isOnline: boolean;
}

export function buildMemberRows(
  group: GroupInfo,
  myId: string,
  nameOf: (id: string) => string,
  onlineIds: Set<string>,
): MemberRowState[] {
  return group.memberIds.map((id) => ({
    memberId: id,
    name: nameOf(id),
    isMe: id === myId,
    isAdmin: group.adminIds.includes(id),
    isMuted: group.mutedMembers.includes(id),
    isBlocked: group.blockedMembers.includes(id),
    isOnline: onlineIds.has(id),
  }));
}

export interface MemberMenuLabels {
  promote: string;
  mute: string;
  unmute: string;
  block: string;
  unblock: string;
  kick: string;
}

export interface MemberMenuHandlers {
  onPromote: (id: string) => void;
  onToggleMute: (id: string, on: boolean) => void;
  onToggleBlock: (id: string, on: boolean) => void;
  onKick: (id: string) => void;
}

export function buildMemberMenuItems(
  row: MemberRowState,
  viewerIsAdmin: boolean,
  labels: MemberMenuLabels,
  handlers: MemberMenuHandlers,
  iconRenderer: (name: string, danger?: boolean) => React.ReactNode,
): MenuProps["items"] {
  if (!viewerIsAdmin || row.isMe) return [];
  const items: NonNullable<MenuProps["items"]> = [];
  if (!row.isAdmin) {
    items.push({
      key: "promote",
      label: labels.promote,
      icon: iconRenderer("shield_person"),
      onClick: () => handlers.onPromote(row.memberId),
    });
  }
  items.push({
    key: "mute",
    label: row.isMuted ? labels.unmute : labels.mute,
    icon: iconRenderer(row.isMuted ? "volume_up" : "volume_off"),
    onClick: () => handlers.onToggleMute(row.memberId, !row.isMuted),
  });
  items.push({
    key: "block",
    label: row.isBlocked ? labels.unblock : labels.block,
    icon: iconRenderer("block", !row.isBlocked),
    danger: !row.isBlocked,
    onClick: () => handlers.onToggleBlock(row.memberId, !row.isBlocked),
  });
  items.push({ type: "divider" });
  items.push({
    key: "kick",
    label: labels.kick,
    icon: iconRenderer("person_remove", true),
    danger: true,
    onClick: () => handlers.onKick(row.memberId),
  });
  return items;
}
