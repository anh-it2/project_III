"use client";

import {
  DeleteOutlined,
  EditOutlined,
  EnterOutlined,
  MoreOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, message as antdMessage } from "antd";
import type { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { ConfirmModal } from "@/shared/components/modal/ConfirmModal";
import { usePinnedMessagesStore } from "../../../../stores/pinned-messages.store";
import type { ReplyContext } from "../../../../types";
import styles from "./MessageActionMenu.module.scss";

interface MessageActionMenuProps {
  id: string;
  conversationId: string;
  senderId: string;
  mine: boolean;
  type: "text" | "image" | "file" | "video";
  content: string;
  senderName: string;
  senderSeed?: string;
  onReply?: (ctx: ReplyContext) => void;
  onStartEdit?: () => void;
  onUnsend?: (id: string) => Promise<void> | void;
  placement?: "bottomLeft" | "bottomRight";
}

export function MessageActionMenu({
  id,
  conversationId,
  senderId,
  mine,
  type,
  content,
  senderName,
  senderSeed,
  onReply,
  onStartEdit,
  onUnsend,
  placement = "bottomRight",
}: MessageActionMenuProps) {
  const t = useTranslations("Chat.actionMenu");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const canEdit = mine && type === "text" && !!onStartEdit;
  const canUnsend = mine && !!onUnsend;
  const myId = useAuthStore((s) => s.userId);
  const pinned = usePinnedMessagesStore((s) =>
    s.pinned[conversationId]?.some((m) => m.id === id) ?? false,
  );
  const pinMessage = usePinnedMessagesStore((s) => s.pinMessage);
  const unpinMessage = usePinnedMessagesStore((s) => s.unpinMessage);

  const items: MenuProps["items"] = [
    onReply
      ? { key: "reply", icon: <EnterOutlined />, label: t("reply") }
      : null,
    {
      key: "pin",
      icon: <PushpinOutlined />,
      label: pinned ? t("unpin") : t("pin"),
    },
    canEdit ? { key: "edit", icon: <EditOutlined />, label: t("edit") } : null,
    canUnsend
      ? {
          key: "unsend",
          icon: <DeleteOutlined />,
          label: t("unsend"),
          danger: true,
        }
      : null,
  ].filter(Boolean) as MenuProps["items"];

  if (!items || items.length === 0) return null;

  function handleClick({ key }: { key: string }) {
    if (key === "reply" && onReply) {
      onReply({
        id,
        senderId: mine ? "me" : senderSeed ?? senderName,
        senderName,
        content,
        type,
      });
    } else if (key === "edit" && onStartEdit) {
      onStartEdit();
    } else if (key === "unsend") {
      setConfirmOpen(true);
    } else if (key === "pin") {
      if (pinned) {
        unpinMessage(conversationId, id);
        antdMessage.success(t("unpinnedToast"));
      } else {
        pinMessage(conversationId, {
          id,
          content,
          type,
          senderId,
          senderName,
          pinnedAt: Date.now(),
          pinnedBy: myId,
        });
        antdMessage.success(t("pinnedToast"));
      }
    }
  }

  async function handleConfirmUnsend() {
    if (!onUnsend) return;
    try {
      await onUnsend(id);
      setConfirmOpen(false);
    } catch {
      antdMessage.error(t("unsendError"));
    }
  }

  return (
    <>
      <Dropdown
        menu={{ items, onClick: handleClick, className: styles.menu }}
        trigger={["click"]}
        placement={placement}
      >
        <Button
          type="text"
          size="small"
          icon={<MoreOutlined />}
          className="!h-7 !w-7 !rounded-full opacity-0 transition-opacity group-hover:opacity-100"
          style={{ color: "var(--color-text-secondary)" }}
        />
      </Dropdown>
      <ConfirmModal
        open={confirmOpen}
        title={t("unsendConfirmTitle")}
        description={t("unsendConfirmDesc")}
        okText={t("unsend")}
        danger
        iconName="delete"
        onOk={handleConfirmUnsend}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
