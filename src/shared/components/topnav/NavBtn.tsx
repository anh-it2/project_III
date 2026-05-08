"use client";

import { Button } from "antd";
import { Icon } from "@/shared/components/Icon";

interface NavBtnProps {
  icon: string;
  active?: boolean;
}

export function NavBtn({ icon, active }: NavBtnProps) {
  return (
    <Button
      type="text"
      className="topnav-btn !flex !h-10 !w-10 !items-center !justify-center !rounded-[10px] !p-0"
      style={{ background: active ? "var(--color-bg-tertiary)" : "transparent" }}
    >
      <style>{`
        .topnav-btn:hover { background: var(--color-bg-tertiary) !important; }
      `}</style>
      <Icon name={icon} size={22} color="var(--color-text-muted)" />
    </Button>
  );
}
