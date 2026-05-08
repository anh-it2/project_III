"use client";

import { useState } from "react";

const FILTERS = ["All", "Unread", "Groups", "Requests"] as const;
type Filter = (typeof FILTERS)[number];

export function SidebarFilters() {
  const [active, setActive] = useState<Filter>("All");

  return (
    <div className="flex gap-2 px-4 py-3">
      {FILTERS.map((label) => {
        const isActive = label === active;
        return (
          <button
            key={label}
            type="button"
            onClick={() => setActive(label)}
            className={
              "rounded-2xl px-3.5 py-1.5 text-[13px] transition " +
              (isActive
                ? "bg-[var(--color-primary)] font-semibold text-white"
                : "bg-[#f0f2f5] font-medium text-[var(--color-text)] hover:bg-[#e4e6eb] dark:bg-[#1f1f1f] dark:hover:bg-[#262626]")
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
