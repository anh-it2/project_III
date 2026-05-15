import { create } from "zustand";

export type UnreadKind = "message" | "reaction";

interface ChatRoomUnreadState {
  unread: Record<string, boolean>;
  /** what the unread entry is about — drives the dropdown preview text */
  kind: Record<string, UnreadKind>;
  /** last activity timestamp per id — drives recency ordering */
  lastActivity: Record<string, number>;
  activePeerId: string | null;
  markUnread: (peerId: string, kind?: UnreadKind) => void;
  markRead: (peerId: string) => void;
  setActivePeer: (peerId: string | null) => void;
}

export const useChatRoomUnreadStore = create<ChatRoomUnreadState>((set) => ({
  unread: {},
  kind: {},
  lastActivity: {},
  activePeerId: null,
  markUnread: (peerId, kind = "message") =>
    set((s) => ({
      unread: s.unread[peerId] ? s.unread : { ...s.unread, [peerId]: true },
      kind: { ...s.kind, [peerId]: kind },
      lastActivity: { ...s.lastActivity, [peerId]: Date.now() },
    })),
  markRead: (peerId) =>
    set((s) => {
      if (!s.unread[peerId]) return s;
      const { [peerId]: _u, ...unread } = s.unread;
      const { [peerId]: _k, ...kind } = s.kind;
      return { unread, kind };
    }),
  setActivePeer: (peerId) =>
    set((s) => {
      if (s.activePeerId === peerId) return s;
      if (peerId && s.unread[peerId]) {
        const { [peerId]: _u, ...unread } = s.unread;
        const { [peerId]: _k, ...kind } = s.kind;
        return { activePeerId: peerId, unread, kind };
      }
      return { activePeerId: peerId };
    }),
}));
