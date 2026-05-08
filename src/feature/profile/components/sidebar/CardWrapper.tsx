"use client";

import { Flex } from "antd";
import type { ReactNode } from "react";

interface CardWrapperProps {
  children: ReactNode;
  gap?: number;
  padding?: number;
}

export function CardWrapper({
  children,
  gap = 20,
  padding = 24,
}: CardWrapperProps) {
  return (
    <Flex
      vertical
      gap={gap}
      className="!w-full"
      style={{
        background: "#111114",
        border: "1px solid #1e1e2e",
        borderRadius: 20,
        padding,
        boxShadow: "0 2px 16px #00000030",
      }}
    >
      {children}
    </Flex>
  );
}
