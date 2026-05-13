"use client";

import { App, Button, Flex } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { ConfirmModal } from "@/shared/components/modal/ConfirmModal";
import { useGroupActions } from "../../hooks/useGroupActions";
import type { GroupInfo } from "../../stores/chat.store.type";
import { TransferAdminModal } from "./TransferAdminModal";

interface GroupActionsPanelProps {
  group: GroupInfo;
  myId: string;
}

export function GroupActionsPanel({ group, myId }: GroupActionsPanelProps) {
  const t = useTranslations("GroupAdmin.actions");
  const { message } = App.useApp();
  const { leave, remove } = useGroupActions(group.conversationId);
  const [openLeave, setOpenLeave] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const iAmAdmin = group.adminIds.includes(myId);
  const isOnlyAdmin =
    iAmAdmin && group.adminIds.length === 1 && group.memberIds.length > 1;

  async function doLeave() {
    if (busy) return;
    setBusy(true);
    const ack = await leave();
    setBusy(false);
    if (ack.ok) {
      message.success(t("leftGroup"));
      setOpenLeave(false);
    } else if (ack.error === "must_transfer_admin") {
      setOpenLeave(false);
      setOpenTransfer(true);
    } else {
      message.error(ack.error ?? t("actionFailed"));
    }
  }

  async function doDelete() {
    if (busy) return;
    setBusy(true);
    const ack = await remove();
    setBusy(false);
    if (ack.ok) message.success(t("deletedGroup"));
    else message.error(ack.error ?? t("actionFailed"));
    setOpenDelete(false);
  }

  return (
    <Flex vertical gap={8}>
      <Button
        block
        icon={<Icon name="logout" size={16} color="var(--color-error)" />}
        danger
        onClick={() => {
          if (isOnlyAdmin) setOpenTransfer(true);
          else setOpenLeave(true);
        }}
      >
        {t("leaveGroup")}
      </Button>
      {iAmAdmin ? (
        <Button
          block
          icon={<Icon name="delete" size={16} color="var(--color-error)" />}
          danger
          type="primary"
          onClick={() => setOpenDelete(true)}
        >
          {t("deleteGroup")}
        </Button>
      ) : null}
      <ConfirmModal
        open={openLeave}
        title={t("leaveTitle")}
        description={t("leaveDesc", { name: group.name })}
        okText={t("leaveOk")}
        cancelText={t("cancel")}
        iconName="logout"
        danger
        onOk={doLeave}
        onCancel={() => setOpenLeave(false)}
      />
      <ConfirmModal
        open={openDelete}
        title={t("deleteTitle")}
        description={t("deleteDesc", { name: group.name })}
        okText={t("deleteOk")}
        cancelText={t("cancel")}
        iconName="delete"
        danger
        onOk={doDelete}
        onCancel={() => setOpenDelete(false)}
      />
      <TransferAdminModal
        open={openTransfer}
        group={group}
        myId={myId}
        onClose={() => setOpenTransfer(false)}
        onTransferred={() => {
          // after handover, prompt user to actually leave
          setOpenLeave(true);
        }}
      />
    </Flex>
  );
}
