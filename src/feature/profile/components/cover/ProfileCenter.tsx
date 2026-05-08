"use client";

import { Flex } from "antd";
import { ProfileActions } from "./ProfileActions";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileIdentity } from "./ProfileIdentity";

export function ProfileCenter() {
  return (
    <Flex
      vertical
      align="center"
      gap={16}
      className="!relative !z-10"
      style={{ paddingBottom: 40 }}
    >
      <ProfileAvatar />
      <ProfileIdentity />
      <ProfileActions />
    </Flex>
  );
}
