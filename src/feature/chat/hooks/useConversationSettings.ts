"use client";

import { useCallback, useEffect } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { getChatSocket } from "../socket";
import { useConversationSettingsStore } from "../stores/conversation-settings.store";
import {
  ConversationSettingsDTO,
  SetThemeDTO,
  SetEmojiDTO,
  SetNicknameDTO,
} from "../dto/conversation-settings.dto";

const EMPTY_SETTINGS: ConversationSettingsDTO = { conversationId: "" };

export function useConversationSettings(conversationId: string) {
  const { userId, userName } = useAuthStore();
  const socket = getChatSocket();

  const stored = useConversationSettingsStore(
    (s) => s.settings[conversationId],
  );
  const settings = stored ?? EMPTY_SETTINGS;
  const setAll = useConversationSettingsStore((s) => s.setAll);
  const setThemeLocal = useConversationSettingsStore((s) => s.setTheme);
  const setEmojiLocal = useConversationSettingsStore((s) => s.setEmoji);
  const setNicknameLocal = useConversationSettingsStore((s) => s.setNickname);
  const setMutedLocal = useConversationSettingsStore((s) => s.setMuted);
  const setE2EELocal = useConversationSettingsStore((s) => s.setE2EE);

  // Fetch latest settings from server on mount; fall back to cache silently.
  useEffect(() => {
    if (!conversationId || !socket) return;
    const ask = () => {
      socket.emit(
        "settings:get",
        { conversationId },
        (data: ConversationSettingsDTO | null) => {
          if (data) setAll(conversationId, data);
        },
      );
    };
    if (socket.connected) ask();
    socket.on("connect", ask);
    return () => {
      socket.off("connect", ask);
    };
  }, [conversationId, socket, setAll]);

  // Listen for peer-driven updates.
  useEffect(() => {
    if (!socket) return;
    const onUpdated = (data: ConversationSettingsDTO) => {
      if (data.conversationId !== conversationId) return;
      setAll(conversationId, data);
    };
    const onTheme = (data: SetThemeDTO) => {
      if (data.conversationId !== conversationId) return;
      setThemeLocal(conversationId, data.themeId);
    };
    const onEmoji = (data: SetEmojiDTO) => {
      if (data.conversationId !== conversationId) return;
      setEmojiLocal(conversationId, data.emoji);
    };
    const onNickname = (data: SetNicknameDTO) => {
      if (data.conversationId !== conversationId) return;
      setNicknameLocal(conversationId, data.targetUserId, data.nickname);
    };
    socket.on("settings:updated", onUpdated);
    socket.on("settings:themeChanged", onTheme);
    socket.on("settings:emojiChanged", onEmoji);
    socket.on("settings:nicknameChanged", onNickname);
    return () => {
      socket.off("settings:updated", onUpdated);
      socket.off("settings:themeChanged", onTheme);
      socket.off("settings:emojiChanged", onEmoji);
      socket.off("settings:nicknameChanged", onNickname);
    };
  }, [
    socket,
    conversationId,
    setAll,
    setThemeLocal,
    setEmojiLocal,
    setNicknameLocal,
  ]);

  const setTheme = useCallback(
    async (themeId: string) => {
      setThemeLocal(conversationId, themeId);
      if (!socket?.connected) return;
      socket.emit(
        "settings:setTheme",
        { conversationId, themeId, actorId: userId, actorName: userName },
        () => undefined,
      );
    },
    [conversationId, socket, userId, userName, setThemeLocal],
  );

  const setEmoji = useCallback(
    async (emoji: string) => {
      setEmojiLocal(conversationId, emoji);
      if (!socket?.connected) return;
      socket.emit(
        "settings:setEmoji",
        { conversationId, emoji, actorId: userId, actorName: userName },
        () => undefined,
      );
    },
    [conversationId, socket, userId, userName, setEmojiLocal],
  );

  const setNickname = useCallback(
    async (targetUserId: string, nickname: string) => {
      setNicknameLocal(conversationId, targetUserId, nickname);
      if (!socket?.connected) return;
      socket.emit(
        "settings:setNickname",
        {
          conversationId,
          targetUserId,
          nickname,
          actorId: userId,
          actorName: userName,
        },
        () => undefined,
      );
    },
    [conversationId, socket, userId, userName, setNicknameLocal],
  );

  const setMuted = useCallback(
    async (muted: boolean, mutedUntil?: number) => {
      setMutedLocal(conversationId, muted, mutedUntil);
      if (!socket?.connected) return;
      socket.emit(
        "settings:mute",
        { conversationId, muted, mutedUntil },
        () => undefined,
      );
    },
    [conversationId, socket, setMutedLocal],
  );

  const setE2EE = useCallback(
    async (enabled: boolean) => {
      let publicKey: string | undefined;
      if (enabled && typeof crypto !== "undefined") {
        const bytes = new Uint8Array(32);
        crypto.getRandomValues(bytes);
        publicKey = btoa(String.fromCharCode(...bytes));
      }
      setE2EELocal(conversationId, enabled, publicKey);
      if (!socket?.connected || !enabled || !publicKey) return;
      socket.emit(
        "e2ee:init",
        { conversationId, publicKey },
        () => undefined,
      );
    },
    [conversationId, socket, setE2EELocal],
  );

  return {
    settings,
    setTheme,
    setEmoji,
    setNickname,
    setMuted,
    setE2EE,
  };
}
