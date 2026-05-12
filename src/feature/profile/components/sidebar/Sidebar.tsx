"use client";

import { Flex } from "antd";
import { AboutCard } from "./about/AboutCard";
import { FriendsCard } from "./friends/FriendsCard";
import { PhotosCard } from "./photos/PhotosCard";

interface SidebarProps {
  onEditAbout: () => void;
}

export function Sidebar({ onEditAbout }: SidebarProps) {
  return (
    <Flex
      vertical
      gap={20}
      className="!w-full lg:!w-[340px] lg:!shrink-0 xl:!w-[380px]"
    >
      <AboutCard onEditAbout={onEditAbout} />
      <FriendsCard />
      <PhotosCard />
    </Flex>
  );
}
