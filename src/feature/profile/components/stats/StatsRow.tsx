"use client";

import { Flex } from "antd";
import { useFriendsList } from "@/feature/friends/hooks/useFriends";
import { useUserPosts } from "@/feature/feed/data/useUserPosts";
import { STATS } from "../../data/mock";
import { StatCard } from "./StatCard";

export function StatsRow() {
  const friendsCount = useFriendsList().length;
  const { posts } = useUserPosts();
  const photosCount = posts.filter((p) => p.imageUrl).length;
  const likesCount = posts.reduce(
    (n, p) => n + (parseInt(p.likes, 10) || 0),
    0,
  );

  // All real / per-account — no mock counts. Keep STATS only for the
  // card order, gradient and label.
  const byLabel: Record<string, string> = {
    Posts: String(posts.length),
    Friends: String(friendsCount),
    Photos: String(photosCount),
    Likes: String(likesCount),
  };
  const items = STATS.map((s) => ({ ...s, value: byLabel[s.label] ?? s.value }));

  return (
    <Flex
      gap={12}
      wrap
      className="!w-full !px-4 !py-4 sm:!gap-4 sm:!px-6 md:!py-5 lg:!px-12"
    >
      {items.map((s) => (
        <StatCard key={s.id} item={s} />
      ))}
    </Flex>
  );
}
