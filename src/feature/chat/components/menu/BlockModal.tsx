"use client";

import { message as antdMessage } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ConfirmModal } from "@/shared/components/modal/ConfirmModal";
import { useConversationSettingsStore } from "../../stores/conversation-settings.store";
import { getChatSocket } from "../../socket";

interface BlockModalProps {
  open: boolean;
  peerId: string;
  peerName: string;
  onClose: () => void;
}

export function BlockModal({ open, peerId, peerName, onClose }: BlockModalProps) {
  const t = useTranslations("ChatMenu.blockModal");
  const blocked = useConversationSettingsStore((s) => s.isBlocked(peerId));
  const setBlocked = useConversationSettingsStore((s) => s.setBlocked);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    if (busy) return;
    setBusy(true);
    const next = !blocked;
    setBlocked(peerId, next);
    const socket = getChatSocket();
    if (socket?.connected) {
      socket.emit(
        "settings:block",
        { targetUserId: peerId, blocked: next },
        () => undefined,
      );
    }
    setBusy(false);
    antdMessage.success(next ? t("blocked") : t("unblocked"));
    onClose();
  }

  return (
    <ConfirmModal
      open={open}
      title={blocked ? t("titleUnblock") : t("titleBlock")}
      description={
        blocked
          ? t("descUnblock", { name: peerName })
          : t("descBlock", { name: peerName })
      }
      okText={blocked ? t("unblock") : t("block")}
      cancelText={t("cancel")}
      iconName="block"
      danger
      onOk={confirm}
      onCancel={onClose}
    />
  );
}
