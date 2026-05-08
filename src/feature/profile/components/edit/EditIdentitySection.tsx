"use client";

import { Flex, Typography } from "antd";
import { useFormContext, useWatch } from "react-hook-form";
import { RHFTextArea } from "@/shared/components/form-fields/RHFTextArea";
import { RHFTextField } from "@/shared/components/form-fields/RHFTextField";
import { EditCard } from "./EditCard";
import type { EditProfileValues } from "./edit-profile.schema";

const { Text } = Typography;
const BIO_MAX = 160;

export function EditIdentitySection() {
  const { control } = useFormContext<EditProfileValues>();
  const bio = useWatch({ control, name: "bio" }) ?? "";

  return (
    <EditCard
      title="Basic Info"
      description="Your name, headline, and where you're based."
    >
      <Flex vertical gap={16} className="!w-full">
        <RHFTextField
          name="name"
          label="Display name"
          placeholder="e.g. Sarah Anderson"
          isRequire
          autoComplete="name"
        />

        <Flex vertical gap={4} className="!w-full">
          <RHFTextArea
            name="bio"
            label="Bio"
            placeholder="Tell people what you do, in one line."
            rows={3}
            maxLength={BIO_MAX + 20}
          />
          <Flex justify="end">
            <Text
              className="!text-xs"
              style={{
                color: bio.length > BIO_MAX ? "#ef4444" : "var(--color-text-muted)",
              }}
            >
              {bio.length}/{BIO_MAX}
            </Text>
          </Flex>
        </Flex>

        <RHFTextField
          name="location"
          label="Location"
          placeholder="City, Country"
          isRequire
          autoComplete="address-level2"
        />
      </Flex>
    </EditCard>
  );
}
