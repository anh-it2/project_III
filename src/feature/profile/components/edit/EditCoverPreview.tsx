"use client";

import { Button, Flex, Typography } from "antd";
import { useFormContext, useWatch } from "react-hook-form";
import { Icon } from "../Icon";
import { gradientBg } from "../../data/mock";
import { EditCard } from "./EditCard";
import {
  EDIT_AVATAR_GRADIENT,
  EDIT_AVATAR_SIZE,
  EDIT_COVER_GRADIENT,
  EDIT_COVER_HEIGHT,
} from "./edit-profile.constants";
import type { EditProfileValues } from "./edit-profile.schema";

const { Text } = Typography;

export function EditCoverPreview() {
  const { control } = useFormContext<EditProfileValues>();
  const name = useWatch({ control, name: "name" });
  const initials = (name || "?")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <EditCard
      title="Cover & Avatar"
      description="Upload images that represent you. Avatar shows on every post."
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: EDIT_COVER_HEIGHT,
          borderRadius: 14,
          background: EDIT_COVER_GRADIENT,
        }}
      >
        <div className="absolute right-4 top-4">
          <Button
            type="text"
            className="!h-9 !rounded-3xl !border-0 !px-4"
            style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}
          >
            <Flex align="center" gap={6}>
              <Icon name="photo_camera" size={16} color="#fff" />
              <span className="text-xs font-semibold">Change Cover</span>
            </Flex>
          </Button>
        </div>
      </div>

      <Flex align="center" gap={20} className="!w-full">
        <div
          className="flex shrink-0 items-center justify-center"
          style={{
            width: EDIT_AVATAR_SIZE,
            height: EDIT_AVATAR_SIZE,
            borderRadius: "50%",
            background: gradientBg([...EDIT_AVATAR_GRADIENT]),
            border: "4px solid var(--color-bg-secondary)",
            boxShadow: "0 4px 24px #4096ff40",
          }}
        >
          <Text
            className="!text-3xl !font-bold"
            style={{ color: "#fff", letterSpacing: 1 }}
          >
            {initials || "?"}
          </Text>
        </div>
        <Flex vertical gap={8}>
          <Text
            className="!text-sm !font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            Profile picture
          </Text>
          <Text className="!text-xs" style={{ color: "var(--color-text-muted)" }}>
            JPG, PNG. Max 4MB. Square recommended.
          </Text>
          <Flex gap={8}>
            <Button
              type="text"
              className="!h-9 !rounded-3xl !border-0 !px-4"
              style={{
                background: gradientBg([...EDIT_AVATAR_GRADIENT]),
                color: "#fff",
              }}
            >
              <span className="text-xs font-semibold">Upload</span>
            </Button>
            <Button
              type="text"
              className="!h-9 !rounded-3xl !border !px-4"
              style={{
                borderColor: "var(--color-border)",
                background: "transparent",
                color: "var(--color-text-secondary)",
              }}
            >
              <span className="text-xs font-semibold">Remove</span>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </EditCard>
  );
}
