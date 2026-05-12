"use client";

import { Flex } from "antd";
import { useState } from "react";
import { ContentArea } from "./ContentArea";
import { CoverSection } from "./cover/CoverSection";
import { HighlightsStrip } from "./highlights/HighlightsStrip";
import { StatsAndTabs } from "./stats/StatsAndTabs";
import { TopNav } from "@/shared/components/topnav/TopNav";
import type { TabId } from "../data/mock";

export function ProfilePage() {
  const [tab, setTab] = useState<TabId>("Posts");

  return (
    <Flex
      vertical
      className="!min-h-screen !w-full"
      style={{ background: "var(--color-bg)" }}
    >
      <TopNav />
      <CoverSection />
      <HighlightsStrip />
      <StatsAndTabs active={tab} onChange={setTab} />
      <ContentArea tab={tab} onEditAbout={() => setTab("About")} />
    </Flex>
  );
}
