"use client";

import { Flex } from "antd";
import { MainFeed } from "./feed/MainFeed";
import { Sidebar } from "./sidebar/Sidebar";

export function ContentArea() {
  return (
    <Flex
      gap={24}
      className="!w-full"
      style={{ background: "#0a0a0a", padding: "24px 48px" }}
    >
      <Sidebar />
      <MainFeed />
    </Flex>
  );
}
