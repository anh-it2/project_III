import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface PinnedMessageInfo {
  id: string;
  content: string;
  type: "text" | "image" | "file" | "video";
  senderId: string;
  senderName: string;
  pinnedAt: number;
  pinnedBy: string;
}

interface PinnedMessagesState {
  pinned: Record<string, PinnedMessageInfo[]>;
  pinMessage: (conversationId: string, message: PinnedMessageInfo) => void;
  unpinMessage: (conversationId: string, messageId: string) => void;
  isPinned: (conversationId: string, messageId: string) => boolean;
  getPinned: (conversationId: string) => PinnedMessageInfo[];
}

export const usePinnedMessagesStore = create<PinnedMessagesState>()(
  persist(
    (set, get) => ({
      pinned: {},

      pinMessage: (conversationId, message) =>
        set((state) => {
          const list = state.pinned[conversationId] ?? [];
          if (list.some((m) => m.id === message.id)) return state;
          return {
            pinned: {
              ...state.pinned,
              [conversationId]: [message, ...list],
            },
          };
        }),

      unpinMessage: (conversationId, messageId) =>
        set((state) => {
          const list = state.pinned[conversationId] ?? [];
          const next = list.filter((m) => m.id !== messageId);
          return {
            pinned: { ...state.pinned, [conversationId]: next },
          };
        }),

      isPinned: (conversationId, messageId) =>
        (get().pinned[conversationId] ?? []).some((m) => m.id === messageId),

      getPinned: (conversationId) => get().pinned[conversationId] ?? [],
    }),
    {
      name: "chat-pinned-messages",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ pinned: state.pinned }),
    },
  ),
);
