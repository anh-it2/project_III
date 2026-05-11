"use client";

import { Button, Flex } from "antd";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import { STORIES } from "../../../data/constants";
import { useReelComposer } from "../../../lib/reelComposer";
import type { ReelData } from "../../../data/types";
import { CreateStoryCard } from "./CreateStoryCard";
import { ReelCard } from "../reels/ReelCard";
import { ReelComposerModal } from "../reels/ReelComposerModal";
import { StoryCard } from "./StoryCard";

const REELS_STORAGE_KEY = "feed.reels";

export function Stories() {
  const t = useTranslations("Feed.story");
  const [reels, setReels] = useState<ReelData[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const reelComposer = useReelComposer();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(REELS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ReelData[];
        if (Array.isArray(parsed)) setReels(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(reels));
    } catch {
      // quota exceeded — large media won't persist
    }
  }, [reels, hydrated]);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, reels.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: "smooth" });
  };

  const handleSubmit = (reel: ReelData) => {
    setReels((prev) => [reel, ...prev]);
  };

  return (
    <>
      <div
        className="!relative !w-full !rounded-xl"
        style={{
          background: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
          height: 202,
        }}
      >
        <Flex
          gap={8}
          ref={scrollerRef}
          className="no-scrollbar !h-full !w-full !overflow-x-auto !p-2"
        >
          <CreateStoryCard
            onClick={() => reelComposer?.openComposer(undefined)}
          />
          {reels.map((r) => (
            <ReelCard key={r.id} reel={r} />
          ))}
          {STORIES.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </Flex>
        <Button
          shape="circle"
          aria-label={t("scrollLeft")}
          onClick={() => scrollBy(-1)}
          icon={<Icon name="chevron_left" size={22} color="var(--color-text)" />}
          className={
            "!absolute !left-2 !top-1/2 !z-10 !hidden !h-9 !w-9 -translate-y-1/2 !shadow-md !transition-opacity sm:!flex !items-center !justify-center " +
            (canLeft ? "!opacity-100" : "!pointer-events-none !opacity-0")
          }
          style={{
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
          }}
        />
        <Button
          shape="circle"
          aria-label={t("scrollRight")}
          onClick={() => scrollBy(1)}
          icon={<Icon name="chevron_right" size={22} color="var(--color-text)" />}
          className={
            "!absolute !right-2 !top-1/2 !z-10 !hidden !h-9 !w-9 -translate-y-1/2 !shadow-md !transition-opacity sm:!flex !items-center !justify-center " +
            (canRight ? "!opacity-100" : "!pointer-events-none !opacity-0")
          }
          style={{
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
          }}
        />
      </div>
      <ReelComposerModal
        open={reelComposer?.open ?? false}
        onClose={() => reelComposer?.closeComposer()}
        onSubmit={handleSubmit}
        initial={reelComposer?.initial}
      />
    </>
  );
}
