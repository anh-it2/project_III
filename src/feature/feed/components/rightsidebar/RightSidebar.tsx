"use client";

import { Flex } from "antd";
import { BirthdaysSection } from "./BirthdaysSection";
import { ContactsSection } from "./ContactsSection";
import { SponsoredSection } from "./SponsoredSection";

export function RightSidebar() {
  return (
    <Flex
      vertical
      gap={20}
      className="no-scrollbar !sticky !top-14 !w-80 !shrink-0 !overflow-y-auto !p-4"
      style={{ background: "#0a0a0a", height: "calc(100vh - 56px)" }}
    >
      <SponsoredSection />
      <div className="!h-px !w-full" style={{ background: "#2e2e2e" }} />
      <BirthdaysSection />
      <div className="!h-px !w-full" style={{ background: "#2e2e2e" }} />
      <ContactsSection />
    </Flex>
  );
}
