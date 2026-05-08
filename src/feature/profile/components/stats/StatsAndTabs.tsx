"use client";

import { Flex } from "antd";
import { StatsRow } from "./StatsRow";
import { TabsRow } from "./TabsRow";

export function StatsAndTabs() {
  return (
    <Flex
      vertical
      className="!w-full !shrink-0 !border-b"
      style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}
    >
      <StatsRow />
      <TabsRow />
    </Flex>
  );
}
