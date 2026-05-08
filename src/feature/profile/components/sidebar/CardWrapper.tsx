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
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 20,
        padding,
        boxShadow: "var(--shadow-md)",
      }}
    >
      {children}
    </Flex>
  );
}
