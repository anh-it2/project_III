"use client";

import { Input } from "antd";
import { Icon } from "../Icon";

export function NavSearch() {
  return (
    <Input
      prefix={<Icon name="search" size={20} color="#71717a" />}
      placeholder="Search Facebook..."
      variant="borderless"
      className="!h-10 !w-80 !rounded-full !px-4"
      style={{ background: "#1f1f1f", color: "#71717a" }}
    />
  );
}
