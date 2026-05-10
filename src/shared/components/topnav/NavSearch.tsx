"use client";

import { Input } from "antd";
import { Icon } from "@/shared/components/Icon";

export function NavSearch() {
  return (
    <Input
      prefix={<Icon name="search" size={20} color="var(--color-text-muted)" />}
      placeholder="Search Facebook..."
      variant="borderless"
      className="!h-10 !w-40 !rounded-full !px-4 sm:!w-56 md:!w-64 lg:!w-80"
      style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text)" }}
    />
  );
}
