"use client";

import { Flex } from "antd";
import { TABS, type TabId } from "../../data/mock";
import { TabItem } from "./TabItem";

interface TabsRowProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function TabsRow({ active, onChange }: TabsRowProps) {
  return (
    <Flex
      gap={8}
      className="!w-full !overflow-x-auto !overflow-y-hidden !px-4 !py-3 sm:!px-6 lg:!px-12"
    >
      {TABS.map((t) => (
        <TabItem
          key={t}
          label={t}
          active={t === active}
          onClick={() => onChange(t)}
        />
      ))}
    </Flex>
  );
}
