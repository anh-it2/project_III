"use client";

import type { MenuProps } from "antd";
import { Icon } from "@/shared/components/Icon";

function menuIcon(name: string) {
  return <Icon name={name} size={20} />;
}

function menuLabel(text: string) {
  return (
    <span style={{ fontSize: 14, fontWeight: 500 }}>{text}</span>
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
        icon: menuIcon("delete"),
        label: menuLabel("Remove post"),
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
      icon: menuIcon("flag"),
      label: menuLabel("Report post"),
      danger: true,
    },
  ];
}

