"use client";

import { Flex } from "antd";
import { STATS } from "../../data/mock";
import { StatCard } from "./StatCard";

export function StatsRow() {
  return (
    <Flex gap={16} className="!w-full" style={{ padding: "20px 48px" }}>
      {STATS.map((s) => (
        <StatCard key={s.id} item={s} />
      ))}
    </Flex>
  );
}
