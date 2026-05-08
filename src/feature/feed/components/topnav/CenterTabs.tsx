"use client";

import { Flex } from "antd";
import { Icon } from "@/shared/components/Icon";
import { CENTER_TABS } from "../../data/constants";

export function CenterTabs() {
  return (
    <Flex align="center" gap={4} className="!h-14">
      {CENTER_TABS.map((tab) => (
        <Flex
          key={tab.id}
          align="center"
          justify="center"
          className="!h-14 !w-28 !cursor-pointer"
          style={{
            borderBottom: tab.active ? "3px solid #2374e1" : "3px solid transparent",
          }}
        >
          <Icon
            name={tab.icon}
            size={28}
            color={tab.active ? "#2374e1" : "#b0b3b8"}
          />
        </Flex>
      ))}
    </Flex>
  );
}
