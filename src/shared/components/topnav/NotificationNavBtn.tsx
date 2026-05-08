"use client";

import { Badge, Button, Dropdown } from "antd";
import { useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { RECENT_NOTIFICATIONS } from "@/shared/data/notifications";
import { NotificationDropdownContent } from "./notification-dropdown/NotificationDropdownContent";

export function NotificationNavBtn() {
  const [open, setOpen] = useState(false);
  const unreadCount = RECENT_NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      trigger={["click"]}
      placement="bottomRight"
      popupRender={() => (
        <NotificationDropdownContent onClose={() => setOpen(false)} />
      )}
    >
      <Badge
        count={unreadCount}
        offset={[-2, 2]}
        styles={{
          indicator: {
            boxShadow: "0 0 0 2px var(--color-bg-secondary)",
            fontSize: 12,
            fontWeight: 700,
            height: 20,
            minWidth: 20,
            lineHeight: "20px",
            padding: "0 6px",
            borderRadius: 10,
          },
        }}
      >
        <Button
          type="text"
          className="notif-nav-btn !flex !h-10 !w-10 !items-center !justify-center !rounded-[10px] !p-0"
          style={{ background: open ? "var(--color-bg-tertiary)" : "transparent" }}
        >
          <style>{`
            .notif-nav-btn:hover { background: var(--color-bg-tertiary) !important; }
          `}</style>
          <Icon name="notifications" size={22} color="var(--color-text-muted)" />
        </Button>
      </Badge>
    </Dropdown>
  );
}
