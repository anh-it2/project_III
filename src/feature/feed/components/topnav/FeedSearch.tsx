"use client";

import { Input } from "antd";
import { Icon } from "@/shared/components/Icon";

export function FeedSearch() {
  return (
    <Input
      prefix={<Icon name="search" size={18} color="#b0b3b8" />}
      placeholder="Search Facebook"
      variant="borderless"
      className="!h-10 !w-60 !rounded-full !px-3"
      style={{ background: "#1f1f1f", color: "var(--color-text)" }}
    />
  );
}
