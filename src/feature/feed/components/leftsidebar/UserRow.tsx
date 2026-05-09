"use client";

import { Flex, Typography } from "antd";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { CURRENT_USER } from "../../data/constants";
import { gradientBg } from "@/shared/utils/gradient";

const { Text } = Typography;

export function UserRow() {
  const nav = useNavigation();

  function go() {
    nav.push("/profile");
  }

  return (
    <Flex
      align="center"
      gap={12}
      onClick={go}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      }}
      className="!h-11 !w-full !cursor-pointer !rounded-lg !px-2 hover:!bg-[var(--color-bg-tertiary)]"
    >
      <Flex
        align="center"
        justify="center"
        className="!h-9 !w-9 !shrink-0 !rounded-full"
        style={{ background: gradientBg(CURRENT_USER.gradient) }}
      >
        <Text className="!text-sm !font-bold !leading-none !text-white">
          {CURRENT_USER.initial}
        </Text>
      </Flex>
      <Text
        className="!text-[15px] !font-semibold !leading-tight"
        style={{ color: "var(--color-text)" }}
      >
        {CURRENT_USER.name}
      </Text>
    </Flex>
  );
}
