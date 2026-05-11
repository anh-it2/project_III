"use client";

import { Button, Dropdown, Typography, message } from "antd";
import type { MenuProps } from "antd";
import { useTranslations } from "next-intl";
import { Icon } from "../Icon";

const { Text } = Typography;

interface ShareMenuProps {
  postId: string;
  onShared: () => void;
  className?: string;
  source?: {
    mediaUrl?: string;
    mediaType?: "video" | "image";
    text?: string;
  };
  onShareToReel?: (init: {
    mediaUrl: string;
    mediaType: "video" | "image";
    caption?: string;
  }) => void;
}

export function ShareMenu({
  postId,
  onShared,
  className,
  source,
  onShareToReel,
}: ShareMenuProps) {
  const t = useTranslations("Post");
  const [api, contextHolder] = message.useMessage();

  function handleAction(action: string, label: string) {
    if (action === "copy") {
      const url = `${window.location.origin}/posts/${postId}`;
      void navigator.clipboard.writeText(url);
      api.success(t("linkCopied"));
    } else if (action === "feed" && onShareToReel && source?.mediaUrl && source.mediaType) {
      onShareToReel({
        mediaUrl: source.mediaUrl,
        mediaType: source.mediaType,
        caption: source.text ?? "",
      });
      api.success(`${t("sharedVia")}${label}`);
    } else {
      api.success(`${t("sharedVia")}${label}`);
    }
    onShared();
  }

  const items: MenuProps["items"] = [
    {
      key: "now",
      label: t("shareNow"),
      icon: <Icon name="public" size={16} color="var(--color-text-muted)" />,
      onClick: () => handleAction("now", t("shareNow")),
    },
    {
      key: "feed",
      label: t("shareToFeed"),
      icon: <Icon name="post_add" size={16} color="var(--color-text-muted)" />,
      onClick: () => handleAction("feed", t("shareToFeed")),
    },
    {
      key: "messenger",
      label: t("sendMessenger"),
      icon: <Icon name="chat_bubble" size={16} color="var(--color-text-muted)" />,
      onClick: () => handleAction("messenger", t("sendMessenger")),
    },
    {
      key: "story",
      label: t("shareToStory"),
      icon: <Icon name="auto_stories" size={16} color="var(--color-text-muted)" />,
      onClick: () => handleAction("story", t("shareToStory")),
    },
    { type: "divider" },
    {
      key: "copy",
      label: t("copyLink"),
      icon: <Icon name="link" size={16} color="var(--color-text-muted)" />,
      onClick: () => handleAction("copy", t("copyLink")),
    },
  ];

  return (
    <>
      {contextHolder}
      <Dropdown menu={{ items }} trigger={["click"]} placement="topRight">
        <Button
          type="text"
          className={
            className ??
            "!flex !h-auto !items-center !gap-2 !rounded-lg !px-4 !py-2.5"
          }
        >
          <Icon name="share" size={20} color="var(--color-text-muted)" />
          <Text
            className="!text-sm !font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("share")}
          </Text>
        </Button>
      </Dropdown>
    </>
  );
}
