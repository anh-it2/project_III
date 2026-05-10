import { create } from "zustand";

interface ChatRoomUnreadState {
  unread: Record<string, boolean>;
  activePeerId: string | null;
  markUnread: (peerId: string) => void;
  markRead: (peerId: string) => void;
  setActivePeer: (peerId: string | null) => void;
}

export const useChatRoomUnreadStore = create<ChatRoomUnreadState>((set) => ({
  unread: {},
  activePeerId: null,
  markUnread: (peerId) =>
    set((s) =>
      s.unread[peerId] ? s : { unread: { ...s.unread, [peerId]: true } },
    ),
  markRead: (peerId) =>
    set((s) => {
      if (!s.unread[peerId]) return s;
      const { [peerId]: _u, ...rest } = s.unread;
      return { unread: rest };
    }),
  setActivePeer: (peerId) =>
    set((s) => {
      if (s.activePeerId === peerId) return s;
      if (peerId && s.unread[peerId]) {
        const { [peerId]: _u, ...rest } = s.unread;
        return { activePeerId: peerId, unread: rest };
      }
      return { activePeerId: peerId };
    }),
}));
