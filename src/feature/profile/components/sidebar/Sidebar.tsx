"use client";

import { Flex } from "antd";
import { AboutCard } from "./AboutCard";
import { FriendsCard } from "./FriendsCard";
import { PhotosCard } from "./PhotosCard";

export function Sidebar() {
  return (
    <Flex vertical gap={20} style={{ width: 380, flexShrink: 0 }}>
      <AboutCard />
      <FriendsCard />
      <PhotosCard />
    </Flex>
  );
}
