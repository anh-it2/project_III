import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ChatState, match, type PinnedMessageInfo } from "./chat.store.type";
import type { ConversationSettingsDTO } from "../dto/conversation-settings.dto";

const LEGACY_SETTINGS_KEY = "chat-conversation-settings";
const LEGACY_PINNED_KEY = "chat-pinned-messages";

interface PersistedConversation {
  settings?: ConversationSettingsDTO;
  pinned?: PinnedMessageInfo[];
}

interface PersistedShape {
  optimisticMessages?: ChatState["optimisticMessages"];
  readCursors?: ChatState["readCursors"];
  blockedUsers?: ChatState["blockedUsers"];
  conversations?: Record<string, PersistedConversation>;
}

function ensure(
  state: ChatState["settings"],
  conversationId: string,
): ConversationSettingsDTO {
  return state[conversationId] ?? { conversationId };
}

function readLegacy<T>(key: string): T | undefined {
  if (typeof localStorage === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return (parsed?.state ?? parsed) as T;
  } catch {
    return undefined;
  }
}

function clearLegacy() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(LEGACY_SETTINGS_KEY);
  localStorage.removeItem(LEGACY_PINNED_KEY);
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      optimisticMessages: {},
      typingUsers: {},
      readCursors: {},
      settings: {},
      blockedUsers: {},
      pinned: {},

      addOptimisticMessage: (conversationId, message) => {
        set((state) => ({
          optimisticMessages: {
            ...state.optimisticMessages,
            [conversationId]: [
              ...(state.optimisticMessages[conversationId] || []),
              { ...message, status: message.status ?? "pending" },
            ],
          },
        }));
      },

      reconcileAck: (conversationId, tempId, server) => {
        set((state) => {
          const list = state.optimisticMessages[conversationId] || [];
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: list.map((item) =>
                item.tempId === tempId
                  ? {
                      ...item,
                      id: server.id,
                      timestamp: server.timestamp,
                      status: "sent",
                    }
                  : item,
              ),
            },
          };
        });
      },

      updateStatus: (conversationId, target, status) => {
        set((state) => {
          const list = state.optimisticMessages[conversationId] || [];
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: list.map((item) =>
                match(item, target) ? { ...item, status } : item,
              ),
            },
          };
        });
      },

      markFailed: (conversationId, tempId) => {
        set((state) => {
          const list = state.optimisticMessages[conversationId] || [];
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: list.map((item) =>
                item.tempId === tempId ? { ...item, status: "failed" } : item,
              ),
            },
          };
        });
      },

      markReadUpTo: (conversationId, upToSeq) =>
        set((state) => {
          let changed = false;
          const list = state.optimisticMessages[conversationId];

          if (!list || list.length === 0) return state;

          const next = list.map((msg) => {
            if (
              msg.seq !== undefined &&
              msg.seq <= upToSeq &&
              msg.status !== "read"
            ) {
              changed = true;
              return {
                ...msg,
                status: "read" as const,
              };
            }
            return msg;
          });

          if (!changed) return state;
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: next,
            },
          };
        }),

      setReadCursor: (conversationId, upToSeq) => {
        set((state) => {
          const cur = state.readCursors[conversationId] ?? -1;
          if (upToSeq <= cur) return state;
          return {
            readCursors: {
              ...state.readCursors,
              [conversationId]: upToSeq,
            },
          };
        });
      },

      getReadCursor: (conversationId) => {
        return get().readCursors[conversationId] ?? -1;
      },

      getOptimisticMessages: (conversationId) => {
        return get().optimisticMessages[conversationId] || [];
      },

      getPending: (conversationId) => {
        return (get().optimisticMessages[conversationId] || []).filter(
          (message) => message.status === "pending",
        );
      },

      removeOptimisticMessage: (conversationId, target) => {
        set((state) => {
          const list = state.optimisticMessages[conversationId] || [];
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: list.filter((item) => !match(item, target)),
            },
          };
        });
      },

      setTyping: (conversationId, userId, userName, isTyping) => {
        set((state) => {
          const conv = { ...(state.typingUsers[conversationId] || {}) };
          if (isTyping) {
            conv[userId] = userName;
          } else {
            delete conv[userId];
          }
          return {
            typingUsers: { ...state.typingUsers, [conversationId]: conv },
          };
        });
      },

      clearTyping: (conversationId, userId) => {
        set((state) => {
          const conv = { ...(state.typingUsers[conversationId] || {}) };
          delete conv[userId];

          return {
            typingUsers: { ...state.typingUsers, [conversationId]: conv },
          };
        });
      },

      applyDeletedToOptimistic: (conversationId, id) => {
        set((state) => {
          const list = state.optimisticMessages[conversationId];
          if (!list) return state;
          let changed = false;
          const next = list.map((m) => {
            if (m.id === id && !m.deleted) {
              changed = true;
              return { ...m, deleted: true, content: "" };
            }
            return m;
          });
          if (!changed) return state;
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: next,
            },
          };
        });
      },

      applyEditToOptimistic: (conversationId, id, content, editedAt) => {
        set((state) => {
          const list = state.optimisticMessages[conversationId];
          if (!list) return state;
          let changed = false;
          const next = list.map((m) => {
            if (m.id === id && (m.content !== content || m.editedAt !== editedAt)) {
              changed = true;
              return { ...m, content, editedAt };
            }
            return m;
          });
          if (!changed) return state;
          return {
            optimisticMessages: {
              ...state.optimisticMessages,
              [conversationId]: next,
            },
          };
        });
      },

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
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),
      version: 2,

      partialize: (state) => {
        const ids = new Set<string>([
          ...Object.keys(state.settings),
          ...Object.keys(state.pinned),
        ]);
        const conversations: Record<string, PersistedConversation> = {};
        for (const id of ids) {
          const entry: PersistedConversation = {};
          if (state.settings[id]) entry.settings = state.settings[id];
          if (state.pinned[id]?.length) entry.pinned = state.pinned[id];
          conversations[id] = entry;
        }
        return {
          optimisticMessages: state.optimisticMessages,
          readCursors: state.readCursors,
          blockedUsers: state.blockedUsers,
          conversations,
        } as unknown as ChatState;
      },

      merge: (persisted, current) => {
        const p = (persisted ?? {}) as PersistedShape;
        const settings: ChatState["settings"] = {};
        const pinned: ChatState["pinned"] = {};
        for (const [id, entry] of Object.entries(p.conversations ?? {})) {
          if (entry.settings) settings[id] = entry.settings;
          if (entry.pinned) pinned[id] = entry.pinned;
        }
        return {
          ...current,
          optimisticMessages: p.optimisticMessages ?? current.optimisticMessages,
          readCursors: p.readCursors ?? current.readCursors,
          blockedUsers: p.blockedUsers ?? current.blockedUsers,
          settings,
          pinned,
        };
      },

      migrate: (persistedState, version) => {
        if (version >= 2) return persistedState as ChatState;

        const prev = (persistedState ?? {}) as {
          optimisticMessages?: ChatState["optimisticMessages"];
          readCursors?: ChatState["readCursors"];
        };

        const legacySettings = readLegacy<{
          settings?: ChatState["settings"];
          blockedUsers?: ChatState["blockedUsers"];
        }>(LEGACY_SETTINGS_KEY);
        const legacyPinned = readLegacy<{
          pinned?: ChatState["pinned"];
        }>(LEGACY_PINNED_KEY);

        const settings = legacySettings?.settings ?? {};
        const pinned = legacyPinned?.pinned ?? {};
        const blockedUsers = legacySettings?.blockedUsers ?? {};

        const ids = new Set<string>([
          ...Object.keys(settings),
          ...Object.keys(pinned),
        ]);
        const conversations: Record<string, PersistedConversation> = {};
        for (const id of ids) {
          const entry: PersistedConversation = {};
          if (settings[id]) entry.settings = settings[id];
          if (pinned[id]?.length) entry.pinned = pinned[id];
          conversations[id] = entry;
        }

        clearLegacy();

        return {
          optimisticMessages: prev.optimisticMessages ?? {},
          readCursors: prev.readCursors ?? {},
          blockedUsers,
          conversations,
        } as unknown as ChatState;
      },
    },
  ),
);
