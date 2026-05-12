import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ConversationSettingsDTO } from "../dto/conversation-settings.dto";

interface ConversationSettingsState {
  settings: Record<string, ConversationSettingsDTO>;
  blockedUsers: Record<string, true>;
  setAll: (conversationId: string, data: ConversationSettingsDTO) => void;
  setTheme: (conversationId: string, themeId: string) => void;
  setEmoji: (conversationId: string, emoji: string) => void;
  setNickname: (
    conversationId: string,
    userId: string,
    nickname: string,
  ) => void;
  setMuted: (
    conversationId: string,
    muted: boolean,
    mutedUntil?: number,
  ) => void;
  setBlocked: (userId: string, blocked: boolean) => void;
  setE2EE: (conversationId: string, e2ee: boolean, publicKey?: string) => void;
  isBlocked: (userId: string) => boolean;
  getSettings: (conversationId: string) => ConversationSettingsDTO;
  getNickname: (conversationId: string, userId: string) => string | undefined;
  isMuted: (conversationId: string) => boolean;
}

function ensure(
  state: ConversationSettingsState["settings"],
  conversationId: string,
): ConversationSettingsDTO {
  return state[conversationId] ?? { conversationId };
}

export const useConversationSettingsStore = create<ConversationSettingsState>()(
  persist(
    (set, get) => ({
      settings: {},
      blockedUsers: {},

      setAll: (conversationId, data) =>
        set((state) => ({
          settings: { ...state.settings, [conversationId]: data },
        })),

      setTheme: (conversationId, themeId) =>
        set((state) => {
          const cur = ensure(state.settings, conversationId);
          return {
            settings: {
              ...state.settings,
              [conversationId]: { ...cur, themeId },
            },
          };
        }),

      setEmoji: (conversationId, emoji) =>
        set((state) => {
          const cur = ensure(state.settings, conversationId);
          return {
            settings: {
              ...state.settings,
              [conversationId]: { ...cur, emoji },
            },
          };
        }),

      setNickname: (conversationId, userId, nickname) =>
        set((state) => {
          const cur = ensure(state.settings, conversationId);
          const nicknames = { ...(cur.nicknames ?? {}) };
          if (nickname.trim().length === 0) delete nicknames[userId];
          else nicknames[userId] = nickname.trim();
          return {
            settings: {
              ...state.settings,
              [conversationId]: { ...cur, nicknames },
            },
          };
        }),

      setMuted: (conversationId, muted, mutedUntil) =>
        set((state) => {
          const cur = ensure(state.settings, conversationId);
          return {
            settings: {
              ...state.settings,
              [conversationId]: { ...cur, muted, mutedUntil },
            },
          };
        }),

      setBlocked: (userId, blocked) =>
        set((state) => {
          const next = { ...state.blockedUsers };
          if (blocked) next[userId] = true;
          else delete next[userId];
          return { blockedUsers: next };
        }),

      setE2EE: (conversationId, e2ee, publicKey) =>
        set((state) => {
          const cur = ensure(state.settings, conversationId);
          return {
            settings: {
              ...state.settings,
              [conversationId]: {
                ...cur,
                e2ee,
                e2eePublicKey: publicKey ?? cur.e2eePublicKey,
              },
            },
          };
        }),

      isBlocked: (userId) => !!get().blockedUsers[userId],

      getSettings: (conversationId) =>
        get().settings[conversationId] ?? { conversationId },

      getNickname: (conversationId, userId) =>
        get().settings[conversationId]?.nicknames?.[userId],

      isMuted: (conversationId) => {
        const s = get().settings[conversationId];
        if (!s?.muted) return false;
        if (s.mutedUntil && s.mutedUntil < Date.now()) return false;
        return true;
      },
    }),
    {
      name: "chat-conversation-settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        blockedUsers: state.blockedUsers,
      }),
    },
  ),
);
