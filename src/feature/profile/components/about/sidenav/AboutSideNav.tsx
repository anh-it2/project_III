"use client";

import { Flex, Typography } from "antd";
import {
  ABOUT_CATEGORIES,
  type AboutCategoryId,
} from "../../../data/mock";
import { AboutSideNavItem } from "./AboutSideNavItem";

const { Text } = Typography;

interface AboutSideNavProps {
  active: AboutCategoryId;
  onChange: (id: AboutCategoryId) => void;
}

export function AboutSideNav({ active, onChange }: AboutSideNavProps) {
  return (
    <Flex
      vertical
      gap={4}
      className="!w-full lg:!w-[280px] lg:!shrink-0"
      style={{
        background: "var(--color-bg-secondary)",
        border: "1px solid var(--color-border)",
        borderRadius: 20,
        padding: 16,
        boxShadow: "var(--shadow-md)",
      }}
    >
      <Text
        className="!text-[17px] !font-bold !px-3 !pt-2 !pb-3"
        style={{ color: "var(--color-text)" }}
      >
        About
      </Text>
      {ABOUT_CATEGORIES.map((c) => (
        <AboutSideNavItem
          key={c.id}
          category={c}
          active={c.id === active}
          onClick={() => onChange(c.id)}
        />
      ))}
    </Flex>
  );
}
