"use client";

import { Flex } from "antd";
import { NotificationItemContent } from "@/shared/components/notification/NotificationItemContent";
import type { Notification } from "@/feature/notification/types";

interface NotificationDropdownItemProps {
  notification: Notification;
  onClick: () => void;
}

export function NotificationDropdownItem({
  notification,
  onClick,
}: NotificationDropdownItemProps) {
  const unread = !notification.read;

  return (
    <Flex
      align="center"
      gap={12}
      onClick={onClick}
      className="chat-dd-item !w-full !cursor-pointer !rounded-[10px] !px-3 !py-2"
    >
      <NotificationItemContent notification={notification} />
      {unread ? (
        <span className="!h-2.5 !w-2.5 !shrink-0 !rounded-full !bg-[#4096ff]" />
      ) : null}
    </Flex>
  );
}
