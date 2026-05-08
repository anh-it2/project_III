"use client";

import { Flex } from "antd";
import { HIGHLIGHTS } from "../../data/mock";
import { HighlightItem } from "./HighlightItem";
import { HighlightNew } from "./HighlightNew";

export function HighlightsStrip() {
  return (
    <Flex
      align="center"
      gap={20}
      className="!w-full !shrink-0"
      style={{ background: "#0a0a0a", padding: "20px 48px" }}
    >
      {HIGHLIGHTS.map((h) => (
        <HighlightItem key={h.id} item={h} />
      ))}
      <HighlightNew />
    </Flex>
  );
}
