export type NotificationKind =
  | "like"
  | "comment"
  | "follow"
  | "mention"
  | "share";

export interface NotificationPreview {
  id: string;
  kind: NotificationKind;
  actor: string;
  text: string;
  time: string;
  unread?: boolean;
  gradient: [string, string];
}

export const RECENT_NOTIFICATIONS: NotificationPreview[] = [
  {
    id: "n1",
    kind: "like",
    actor: "Alex Chen",
    text: "liked your photo.",
    time: "2m",
    unread: true,
    gradient: ["#4096ff", "#a855f7"],
  },
  {
    id: "n2",
    kind: "comment",
    actor: "Mia Lopez",
    text: "commented: \"This is amazing! 🎉\"",
    time: "12m",
    unread: true,
    gradient: ["#ec4899", "#8b5cf6"],
  },
  {
    id: "n3",
    kind: "follow",
    actor: "James Wu",
    text: "started following you.",
    time: "1h",
    unread: true,
    gradient: ["#22c55e", "#06b6d4"],
  },
  {
    id: "n4",
    kind: "mention",
    actor: "Design Team",
    text: "mentioned you in a post.",
    time: "3h",
    gradient: ["#f59e0b", "#ef4444"],
  },
  {
    id: "n5",
    kind: "share",
    actor: "Lily Zhang",
    text: "shared your reel.",
    time: "5h",
    gradient: ["#f97316", "#eab308"],
  },
  {
    id: "n6",
    kind: "like",
    actor: "David Kim",
    text: "and 12 others liked your post.",
    time: "1d",
    gradient: ["#06b6d4", "#3b82f6"],
  },
];

export const NOTIFICATION_ICON: Record<NotificationKind, string> = {
  like: "favorite",
  comment: "chat_bubble",
  follow: "person_add",
  mention: "alternate_email",
  share: "share",
};

export const NOTIFICATION_ICON_COLOR: Record<NotificationKind, string> = {
  like: "#ef4444",
  comment: "#4096ff",
  follow: "#22c55e",
  mention: "#a855f7",
  share: "#f59e0b",
};
