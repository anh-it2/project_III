"use client";

import { Button } from "antd";
import { Icon } from "../Icon";

export function MoreButton() {
  return (
    <Button
      type="text"
      className="!flex !h-10 !w-10 !items-center !justify-center !rounded-[20px] !p-0"
      style={{
        background: "#ffffff10",
        border: "1px solid #ffffff20",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Icon name="more_horiz" size={20} color="#d4d4d8" />
    </Button>
  );
}
