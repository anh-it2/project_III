"use client";

import { Flex } from "antd";
import { TABS } from "../../data/mock";
import { TabItem } from "./TabItem";

export function TabsRow() {
  return (
    <Flex gap={8} className="!w-full" style={{ padding: "12px 48px" }}>
      {TABS.map((t, i) => (
        <TabItem key={t} label={t} active={i === 0} />
      ))}
    </Flex>
  );
}
