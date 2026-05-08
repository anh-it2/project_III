"use client";

import { Flex } from "antd";
import { StatsRow } from "./StatsRow";
import { TabsRow } from "./TabsRow";

export function StatsAndTabs() {
  return (
    <Flex
      vertical
      className="!w-full !shrink-0 !border-b"
      style={{ background: "#0f0f0f", borderColor: "#1e1e1e" }}
    >
      <StatsRow />
      <TabsRow />
    </Flex>
  );
}
