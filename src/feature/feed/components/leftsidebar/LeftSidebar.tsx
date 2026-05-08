"use client";

import { Flex, Typography } from "antd";
import { NAV_ROWS, SHORTCUTS } from "../../data/constants";
import { SeeMoreRow } from "./SeeMoreRow";
import { ShortcutItem } from "./ShortcutItem";
import { SidebarRow } from "./SidebarRow";
import { UserRow } from "./UserRow";

const { Text } = Typography;

export function LeftSidebar() {
  return (
    <Flex
      vertical
      gap={2}
      className="no-scrollbar !sticky !top-14 !w-[340px] !shrink-0 !overflow-y-auto !px-2 !py-4"
      style={{
        background: "#0a0a0a",
        height: "calc(100vh - 56px)",
      }}
    >
      <UserRow />
      {NAV_ROWS.map((row) => (
        <SidebarRow
          key={row.id}
          icon={row.icon}
          label={row.label}
          iconBg={row.iconBg}
          active={row.active}
        />
      ))}
      <SeeMoreRow />
      <div
        className="!my-2 !h-px !w-full"
        style={{ background: "#2e2e2e" }}
      />
      <Flex align="center" className="!h-9 !px-2">
        <Text
          className="!text-[15px] !font-semibold"
          style={{ color: "#b0b3b8" }}
        >
          Your shortcuts
        </Text>
      </Flex>
      {SHORTCUTS.map((s) => (
        <ShortcutItem key={s.id} label={s.label} gradient={s.gradient} />
      ))}
    </Flex>
  );
}
