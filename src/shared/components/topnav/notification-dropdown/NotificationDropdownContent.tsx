"use client";

import { Flex } from "antd";
import { RECENT_NOTIFICATIONS } from "@/shared/data/notifications";
import { NotificationDropdownFooter } from "./NotificationDropdownFooter";
import { NotificationDropdownHeader } from "./NotificationDropdownHeader";
import { NotificationDropdownItem } from "./NotificationDropdownItem";

interface NotificationDropdownContentProps {
  onClose: () => void;
}

export function NotificationDropdownContent({
  onClose,
}: NotificationDropdownContentProps) {
  function handleItemClick() {
    onClose();
  }

  function goSeeAll() {
    onClose();
  }

  return (
    <Flex
      vertical
      className="!w-[380px]"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      <NotificationDropdownHeader />
      <Flex
        vertical
        gap={2}
        className="!w-full"
        style={{
          padding: "4px 8px 8px 8px",
          maxHeight: 460,
          overflowY: "auto",
        }}
      >
        {RECENT_NOTIFICATIONS.map((n) => (
          <NotificationDropdownItem
            key={n.id}
            notification={n}
            onClick={handleItemClick}
          />
        ))}
      </Flex>
      <NotificationDropdownFooter onSeeAll={goSeeAll} />
    </Flex>
  );
}
