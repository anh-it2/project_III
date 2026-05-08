"use client";

import { Flex } from "antd";
import { STORIES } from "../../data/constants";
import { CreateStoryCard } from "./CreateStoryCard";
import { StoryCard } from "./StoryCard";

export function Stories() {
  return (
    <Flex
      gap={8}
      className="no-scrollbar !w-full !overflow-x-auto !rounded-xl !p-2"
      style={{
        background: "#141414",
        border: "1px solid #2e2e2e",
        height: 202,
      }}
    >
      <CreateStoryCard />
      {STORIES.map((s) => (
        <StoryCard key={s.id} story={s} />
      ))}
    </Flex>
  );
}
