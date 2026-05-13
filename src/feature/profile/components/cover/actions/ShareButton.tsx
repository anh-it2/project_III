"use client";

import { App, Button, Dropdown, Flex, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useProfileMeta } from "../../edit/data/useProfileMeta";
import { ShareDropdownItem } from "@/shared/components/post/share-dropdown/ShareDropdownItem";
import { SendToChatModal } from "@/shared/components/post/share-dropdown/SendToChatModal";
import shareStyles from "@/shared/components/post/share-dropdown/ShareDropdown.module.scss";
import { Icon } from "../../Icon";

const { Text } = Typography;

export function ShareButton() {
  const t = useTranslations("Profile.actions");
  const tPost = useTranslations("Post");
  const tShare = useTranslations("Profile.share");
  const { message: api } = App.useApp();
  const { meta } = useProfileMeta();
  const [open, setOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  const profileUrl =
    typeof window !== "undefined" ? window.location.href : "/profile";

  const handleCopy = () => {
    void navigator.clipboard.writeText(profileUrl);
    api.success(tPost("linkCopied"));
    setOpen(false);
  };

  const handleSend = () => {
    setOpen(false);
    setSendOpen(true);
  };

  const handleSent = (recipientIds: string[]) => {
    api.success(
      tPost("shareDropdown.sendModal.sentTo", { count: recipientIds.length }),
    );
  };

  return (
    <>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        open={open}
        onOpenChange={setOpen}
        rootClassName={shareStyles.shareDropdownRoot}
        popupRender={() => (
          <Flex
            vertical
            className="!w-[min(340px,calc(100vw-16px))]"
            style={{
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              borderRadius: 16,
              boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
              overflow: "hidden",
            }}
          >
            <Flex
              align="center"
              style={{
                padding: "14px 16px 10px 16px",
                borderBottom: "1px solid var(--color-border-light)",
              }}
            >
              <Text
                className="!text-[17px] !font-bold"
                style={{ color: "var(--color-text)" }}
              >
                {tPost("shareDropdown.header")}
              </Text>
            </Flex>
            <Flex vertical gap={2} style={{ padding: "8px" }}>
              <ShareDropdownItem
                icon="link"
                gradient={["#6B7280", "#4B5563"]}
                title={tPost("copyLink")}
                description={tShare("copyLinkDesc")}
                onClick={handleCopy}
              />
              <ShareDropdownItem
                icon="chat_bubble"
                gradient={["#0084FF", "#44BCFF"]}
                title={tPost("sendMessenger")}
                description={tPost("shareDropdown.sendMessengerDesc")}
                onClick={handleSend}
              />
            </Flex>
          </Flex>
        )}
      >
        <Button
          type="text"
          className="!h-9 !rounded-3xl !px-4 md:!h-10 md:!px-6"
          style={{
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.35)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <Flex align="center" gap={8}>
            <Icon name="share" size={18} color="#ffffff" />
            <Text className="!text-sm !font-semibold" style={{ color: "#ffffff" }}>
              {t("share")}
            </Text>
          </Flex>
        </Button>
      </Dropdown>
      <SendToChatModal
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        onSent={handleSent}
        shareUrl={profileUrl}
        refLabel={tShare("profileRef", { name: meta.name })}
        title={tShare("sendModalTitle")}
        subtitle={tShare("sendModalSubtitle")}
      />
    </>
  );
}
