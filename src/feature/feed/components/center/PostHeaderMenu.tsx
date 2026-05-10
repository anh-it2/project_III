"use client";

import type { MenuProps } from "antd";
import { Icon } from "@/shared/components/Icon";

function menuIcon(name: string, color = "var(--color-text-secondary)") {
  return <Icon name={name} size={20} color={color} />;
}

function menuLabel(text: string, danger = false) {
  return (
    <span
      style={{
        color: danger ? "var(--color-error)" : "var(--color-text)",
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      {text}
    </span>
  );
}

export function makePostHeaderMenuItems(
  authorName: string,
  isOwn = false,
): MenuProps["items"] {
  if (isOwn) {
    return [
      {
        key: "edit",
        icon: menuIcon("edit"),
        label: menuLabel("Edit post"),
      },
      {
        key: "save",
        icon: menuIcon("bookmark_border"),
        label: menuLabel("Save post"),
      },
      {
        key: "pin",
        icon: menuIcon("push_pin"),
        label: menuLabel("Pin post"),
      },
      { type: "divider" },
      {
        key: "remove",
        icon: menuIcon("delete", "var(--color-error)"),
        label: menuLabel("Remove post", true),
        danger: true,
      },
    ];
  }
  return [
    {
      key: "save",
      icon: menuIcon("bookmark_border"),
      label: menuLabel("Save post"),
    },
    {
      key: "hide",
      icon: menuIcon("visibility_off"),
      label: menuLabel("Hide post"),
    },
    {
      key: "snooze",
      icon: menuIcon("notifications_off"),
      label: menuLabel(`Snooze ${authorName} for 30 days`),
    },
    {
      key: "unfollow",
      icon: menuIcon("person_remove"),
      label: menuLabel(`Unfollow ${authorName}`),
    },
    { type: "divider" },
    {
      key: "report",
      icon: menuIcon("flag", "var(--color-error)"),
      label: menuLabel("Report post", true),
      danger: true,
    },
  ];
}

export const POST_HEADER_MENU_STYLES = {
  background: "var(--color-bg-secondary)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
  padding: 6,
  minWidth: 280,
};
