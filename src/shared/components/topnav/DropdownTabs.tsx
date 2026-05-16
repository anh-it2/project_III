"use client";

import { Segmented } from "antd";
import styles from "./DropdownTabs.module.scss";

export type DropdownTabKey = "all" | "unread" | "read";

interface DropdownTabsProps {
  value: DropdownTabKey;
  onChange: (key: DropdownTabKey) => void;
  labels: Record<DropdownTabKey, string>;
}

export function DropdownTabs({ value, onChange, labels }: DropdownTabsProps) {
  const order: DropdownTabKey[] = ["all", "unread", "read"];

  return (
    <div className={`${styles.tabs} !w-full !px-4 !pb-2`}>
      <Segmented<DropdownTabKey>
        value={value}
        onChange={onChange}
        block
        options={order.map((key) => ({
          label: labels[key],
          value: key,
          // Stable, React-state-driven active class. Independent of antd's
          // motion-driven .ant-segmented-item-selected (which is dropped
          // mid-thumb-animation), so the active style never flickers.
          className: key === value ? styles.activeItem : undefined,
        }))}
      />
    </div>
  );
}
