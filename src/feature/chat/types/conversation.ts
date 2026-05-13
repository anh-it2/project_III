import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import type { GroupInfo } from "../stores/chat.store.type";

export type SelectedConversation =
  | { kind: "dm"; user: OnlineUserDto }
  | { kind: "group"; group: GroupInfo };

export type AvatarKind = "initials" | "groups" | "forum";

export interface Conversation {
  id: string;
  name: string;
  initials: string;
  avatarGradient: [string, string];
  avatarKind?: AvatarKind;
  lastMessage: string;
  lastMessageOwn?: boolean;
  time: string;
  unread?: boolean;
  unreadCount?: number;
  online?: boolean;
  presenceLabel?: string;
  read?: boolean;
}

export interface ChatBubble {
  id: string;
  conversationId: string;
  senderId: "me" | "them";
  content: string;
  kind?: "text" | "link";
  linkTitle?: string;
  linkUrl?: string;
}
