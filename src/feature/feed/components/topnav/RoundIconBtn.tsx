"use client";

import { Flex } from "antd";
import { Icon } from "@/shared/components/Icon";

interface RoundIconBtnProps {
  icon: string;
}

export function RoundIconBtn({ icon }: RoundIconBtnProps) {
  return (
    <Flex
      align="center"
      justify="center"
      className="!h-10 !w-10 !shrink-0 !cursor-pointer !rounded-full"
      style={{ background: "#2e2e2e" }}
    >
      <Icon name={icon} size={22} color="#e4e6eb" />
    </Flex>
  );
}
