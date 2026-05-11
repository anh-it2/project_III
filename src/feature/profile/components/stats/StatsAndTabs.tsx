"use client";

import { Flex } from "antd";
import type { TabId } from "../../data/mock";
import { StatsRow } from "./StatsRow";
import { TabsRow } from "./TabsRow";

interface StatsAndTabsProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function StatsAndTabs({ active, onChange }: StatsAndTabsProps) {
  return (
    <Flex
      vertical
      className="!w-full !shrink-0 !border-b"
      style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}
    >
      <StatsRow />
      <TabsRow active={active} onChange={onChange} />
    </Flex>
  );
}
