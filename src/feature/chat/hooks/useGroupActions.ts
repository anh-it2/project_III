"use client";

import { useCallback } from "react";
import { getChatSocket } from "../socket";
import { useChatStore } from "../stores/chat.store";
import type { GroupActionAck } from "../dto/conversation-settings.dto";

const ACK_TIMEOUT_MS = 8000;

function emitWithAck(
  emit: (cb: (ack: GroupActionAck) => void) => void,
): Promise<GroupActionAck> {
  return new Promise((resolve) => {
    let done = false;
    const finish = (ack: GroupActionAck) => {
      if (done) return;
      done = true;
      resolve(ack);
    };
    const timer = setTimeout(
      () => finish({ ok: false, error: "timeout" }),
      ACK_TIMEOUT_MS,
    );
    emit((ack) => {
      clearTimeout(timer);
      finish(ack);
    });
  });
}

export function useGroupActions(conversationId: string) {
  const wrap = useCallback(
    async (
      emit: (cb: (ack: GroupActionAck) => void) => void,
    ): Promise<GroupActionAck> => {
      const ack = await emitWithAck(emit);
      // server lost this group (restart, deleted concurrently) → prune locally
      if (ack.error === "not_found") {
        useChatStore.getState().removeGroup(conversationId);
      }
      return ack;
    },
    [conversationId],
  );

  const leave = useCallback(
    () =>
      wrap((cb) => {
        const s = getChatSocket();
        if (!s) return cb({ ok: false, error: "no_socket" });
        s.emit("group:leave", { conversationId }, cb);
      }),
    [conversationId, wrap],
  );

  const kick = useCallback(
    (targetUserId: string, targetName?: string) =>
      wrap((cb) => {
        const s = getChatSocket();
        if (!s) return cb({ ok: false, error: "no_socket" });
        s.emit(
          "group:kick",
          { conversationId, targetUserId, targetName },
          cb,
        );
      }),
    [conversationId, wrap],
  );

  const promote = useCallback(
    (targetUserId: string) =>
      wrap((cb) => {
        const s = getChatSocket();
        if (!s) return cb({ ok: false, error: "no_socket" });
        s.emit("group:promote", { conversationId, targetUserId }, cb);
      }),
    [conversationId, wrap],
  );

  const muteMember = useCallback(
    (targetUserId: string, on: boolean) =>
      wrap((cb) => {
        const s = getChatSocket();
        if (!s) return cb({ ok: false, error: "no_socket" });
        s.emit(
          "group:mute-member",
          { conversationId, targetUserId, on },
          cb,
        );
      }),
    [conversationId, wrap],
  );

  const blockMember = useCallback(
    (targetUserId: string, on: boolean) =>
      wrap((cb) => {
        const s = getChatSocket();
        if (!s) return cb({ ok: false, error: "no_socket" });
        s.emit(
          "group:block-member",
          { conversationId, targetUserId, on },
          cb,
        );
      }),
    [conversationId, wrap],
  );

  const remove = useCallback(
    () =>
      wrap((cb) => {
        const s = getChatSocket();
        if (!s) return cb({ ok: false, error: "no_socket" });
        s.emit("group:delete", { conversationId }, cb);
      }),
    [conversationId, wrap],
  );

  return { leave, kick, promote, muteMember, blockMember, remove };
}
