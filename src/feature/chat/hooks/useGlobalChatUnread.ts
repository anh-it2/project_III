"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { usePresenceStore } from "@/feature/presence/stores/presence.store";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import type { ChatMessageDTO } from "../dto/chat.dto";
import { buildDmId } from "../lib/conversation";
import { getChatSocket } from "../socket";

export function useGlobalChatUnread() {
  const myId = useAuthStore((s) => s.userId);
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const joinedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!myId) return;
    const socket = getChatSocket();
    if (!socket) return;

    const onMessage = (dto: ChatMessageDTO) => {
      if (dto.senderId === myId) return;
      const { activePeerId, markUnread } = useChatRoomUnreadStore.getState();
      if (dto.senderId === activePeerId) return;
      markUnread(dto.senderId);
    };

    const joinAll = () => {
      for (const u of onlineUsers) {
        if (u.id === myId) continue;
        const conv = buildDmId(myId, u.id);
        if (joinedRef.current.has(conv)) continue;
        socket.emit("chat:join", conv);
        joinedRef.current.add(conv);
      }
    };

    const onReconnect = () => {
      joinedRef.current.clear();
      joinAll();
    };

    socket.on("chat:message", onMessage);
    socket.on("connect", onReconnect);

    if (socket.connected) joinAll();

    return () => {
      socket.off("chat:message", onMessage);
      socket.off("connect", onReconnect);
    };
  }, [myId, onlineUsers]);
}
