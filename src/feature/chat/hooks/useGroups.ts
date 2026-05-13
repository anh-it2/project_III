"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useChatRoomUnreadStore } from "@/shared/stores/chatRoomUnread.store";
import { getChatSocket } from "../socket";
import { useChatStore } from "../stores/chat.store";
import type {
  GroupCreatedDTO,
  GroupDeletedDTO,
  GroupUpdatedDTO,
} from "../dto/conversation-settings.dto";

function toGroupInfo(dto: GroupCreatedDTO) {
  return {
    conversationId: dto.conversationId,
    name: dto.name,
    memberIds: dto.memberIds,
    adminIds: dto.adminIds,
    mutedMembers: dto.mutedMembers,
    blockedMembers: dto.blockedMembers,
    createdAt: dto.createdAt,
    createdBy: dto.createdBy,
  };
}

export function useGroups() {
  const myId = useAuthStore((s) => s.userId);
  const groups = useChatStore((s) => s.groups);

  useEffect(() => {
    if (!myId) return;
    const socket = getChatSocket();
    if (!socket) return;

    const onCreated = (dto: GroupCreatedDTO) => {
      useChatStore.getState().upsertGroup(toGroupInfo(dto));
      socket.emit("chat:join", dto.conversationId);
    };

    const onUpdated = (dto: GroupUpdatedDTO) => {
      useChatStore.getState().upsertGroup(toGroupInfo(dto));
    };

    const onDeleted = (dto: GroupDeletedDTO) => {
      useChatStore.getState().removeGroup(dto.conversationId);
      useChatRoomUnreadStore.getState().markRead(dto.conversationId);
    };

    socket.on("group:created", onCreated);
    socket.on("group:updated", onUpdated);
    socket.on("group:deleted", onDeleted);
    return () => {
      socket.off("group:created", onCreated);
      socket.off("group:updated", onUpdated);
      socket.off("group:deleted", onDeleted);
    };
  }, [myId]);

  useEffect(() => {
    if (!myId) return;
    const socket = getChatSocket();
    if (!socket) return;

    const joinAll = () => {
      for (const conv of Object.keys(groups)) {
        socket.emit("chat:join", conv);
      }
    };

    if (socket.connected) joinAll();
    socket.on("connect", joinAll);
    return () => {
      socket.off("connect", joinAll);
    };
  }, [myId, groups]);
}
