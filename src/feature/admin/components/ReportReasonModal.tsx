"use client";

import { App, Button, Flex, Typography } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { FeedPostData } from "@/feature/feed/data/types";
import { DarkModal } from "@/shared/components/modal/DarkModal";
import { RHFTextArea } from "@/shared/components/form-fields/RHFTextArea";
import { Icon } from "@/shared/components/Icon";
import { emitReport } from "../lib/emit";

const { Title, Text } = Typography;

interface ReportReasonModalProps {
  open: boolean;
  post: FeedPostData;
  onClose: () => void;
  onReported?: () => void;
}

const buildSchema = (msgRequired: string, msgMin: string) =>
  z.object({
    reason: z
      .string()
      .min(1, msgRequired)
      .min(10, msgMin)
      .max(500),
  });

type FormValues = { reason: string };

export function ReportReasonModal({
  open,
  post,
  onClose,
  onReported,
}: ReportReasonModalProps) {
  const t = useTranslations("Feed.post.reportModal");
  const { message } = App.useApp();
  const isLoggined = useAuthStore((s) => s.isLoggined);

  const schema = buildSchema(t("validation.required"), t("validation.min"));

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: { reason: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (open) methods.reset({ reason: "" });
  }, [open, methods]);

  const onValid = (values: FormValues) => {
    if (!isLoggined) {
      message.error(t("notLoggedIn"));
      return;
    }
    emitReport(
      {
        postId: post.id,
        postOwnerId: post.ownerId ?? post.author.id,
        postSnapshot: post,
        reason: values.reason.trim(),
      },
      (ack) => {
        if (ack.ok) {
          message.success(t("submitted"));
          onReported?.();
          onClose();
        } else {
          message.error(t("failed"));
        }
      },
    );
  };

  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  return (
    <DarkModal
      open={open}
      onCancel={onClose}
      width={480}
      centered
      bg="var(--color-bg-secondary)"
      borderColor="var(--color-border)"
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onValid)} noValidate>
          <Flex vertical gap={16} style={{ padding: "24px 28px" }}>
            <Flex align="center" gap={12}>
              <Flex
                align="center"
                justify="center"
                className="!h-10 !w-10 !shrink-0 !rounded-full"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-error) 15%, transparent)",
                }}
              >
                <Icon name="flag" size={22} color="var(--color-error)" />
              </Flex>
              <Title
                level={5}
                className="!m-0 !leading-tight"
                style={{ color: "var(--color-text)" }}
              >
                {t("title")}
              </Title>
            </Flex>
            <Text
              className="!text-sm !leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("description")}
            </Text>
            <RHFTextArea
              name="reason"
              label={t("reasonLabel")}
              placeholder={t("reasonPlaceholder")}
              isRequire
              rows={4}
              maxLength={500}
              showCount
            />
            {hasErrors && (
              <Text
                className="!text-[12px]"
                style={{ color: "var(--color-error)" }}
              >
                {t("fixRequired")}
              </Text>
            )}
            <Flex justify="end" gap={8} style={{ paddingTop: 4 }}>
              <Button
                onClick={onClose}
                style={{
                  background: "var(--color-bg-tertiary)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                {t("cancel")}
              </Button>
              <Button
                htmlType="submit"
                type="primary"
                danger
                style={{ fontWeight: 600 }}
              >
                {t("submit")}
              </Button>
            </Flex>
          </Flex>
        </form>
      </FormProvider>
    </DarkModal>
  );
}
