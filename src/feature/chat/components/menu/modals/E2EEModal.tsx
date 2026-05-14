"use client";

import { App, Button, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { useConversationSettings } from "../../../hooks/useConversationSettings";

const { Title, Text } = Typography;

interface E2EEModalProps {
  open: boolean;
  conversationId: string;
  peerName: string;
  onClose: () => void;
}

export function E2EEModal({
  open,
  conversationId,
  peerName,
  onClose,
}: E2EEModalProps) {
  const t = useTranslations("ChatMenu.e2eeModal");
  const { message } = App.useApp();
  const { settings, setE2EE } = useConversationSettings(conversationId);
  const [busy, setBusy] = useState(false);
  const enabled = !!settings.e2ee;

  async function toggle() {
    setBusy(true);
    await setE2EE(!enabled);
    setBusy(false);
    message.success(!enabled ? t("started") : t("stopped"));
    onClose();
  }

  return (
    <DarkModal
      open={open}
      onCancel={onClose}
      width={420}
      centered
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
      closeIcon={
        <Icon name="close" size={20} color="var(--color-text-secondary)" />
      }
    >
      <Flex vertical gap={16} style={{ padding: "24px 28px" }}>
        <Title
          level={5}
          className="!m-0 !leading-tight"
          style={{ color: "var(--color-text)" }}
        >
          {t("title")}
        </Title>
        <Flex vertical gap={12} align="center" className="!py-2">
          <Flex
            align="center"
            justify="center"
            className="!h-14 !w-14 !rounded-full"
            style={{ background: "var(--color-primary)" }}
          >
            <Icon name="lock" size={28} color="var(--color-on-primary)" />
          </Flex>
          <Text
            className="!text-[15px] !font-semibold !text-center"
            style={{ color: "var(--color-text)" }}
          >
            {enabled
              ? t("activeWith", { name: peerName })
              : t("startWith", { name: peerName })}
          </Text>
          <Text
            className="!text-[13px] !text-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("description")}
          </Text>
          {settings.e2eePublicKey && (
            <Text
              code
              className="!text-[11px] !break-all"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("yourKey")}: {settings.e2eePublicKey.slice(0, 32)}…
            </Text>
          )}
        </Flex>
        <Flex justify="end" gap={8}>
          <Button
            onClick={onClose}
            disabled={busy}
            style={{
              background: "var(--color-bg-tertiary)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            type="primary"
            onClick={toggle}
            loading={busy}
            danger={enabled}
            style={{ fontWeight: 600 }}
          >
            {enabled ? t("stop") : t("start")}
          </Button>
        </Flex>
      </Flex>
    </DarkModal>
  );
}
