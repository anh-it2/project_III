"use client";

import { Flex } from "antd";
import { EditButton } from "./EditButton";
import { ShareButton } from "./ShareButton";
import { MoreButton } from "./MoreButton";

export function ProfileActions() {
  return (
    <Flex align="center" gap={12}>
      <EditButton />
      <ShareButton />
      <MoreButton />
    </Flex>
  );
}
