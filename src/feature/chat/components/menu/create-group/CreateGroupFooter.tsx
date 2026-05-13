"use client";

import { Button, Flex } from "antd";
import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";
import type { GroupFormValues } from "./createGroupForm.utils";

interface CreateGroupFooterProps {
  onCancel: () => void;
  busy: boolean;
}

export function CreateGroupFooter({ onCancel, busy }: CreateGroupFooterProps) {
  const t = useTranslations("ChatMenu.groupModal");
  const { control } = useFormContext<GroupFormValues>();
  const memberIds = useWatch({ control, name: "memberIds" }) ?? [];
  const name = useWatch({ control, name: "name" }) ?? "";
  const count = memberIds.length;
  const canSubmit = name.trim().length > 0 && count >= 2;

  return (
    <Flex justify="end" gap={8} className="!mt-5">
      <Button
        onClick={onCancel}
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
        htmlType="submit"
        loading={busy}
        disabled={!canSubmit || busy}
        style={{ fontWeight: 600 }}
      >
        {t("create", { count })}
      </Button>
    </Flex>
  );
}
