"use client";

import { Flex } from "antd";
import { RHFSelect } from "@/shared/components/form-fields/RHFSelect";
import { RHFTextField } from "@/shared/components/form-fields/RHFTextField";
import { EditCard } from "./EditCard";

const RELATIONSHIP_OPTIONS = [
  { label: "Single", value: "Single" },
  { label: "In a relationship", value: "In a relationship" },
];

export function EditAboutSection() {
  return (
    <EditCard
      title="About"
      description="Details shown in the About panel on your profile."
    >
      <Flex vertical gap={16} className="!w-full">
        <RHFTextField
          name="work"
          label="Work"
          placeholder="e.g. Product Designer at Meta"
        />
        <RHFTextField
          name="education"
          label="Education"
          placeholder="e.g. Stanford University"
        />
        <RHFSelect
          name="relationship"
          label="Relationship"
          placeholder="Select relationship status"
          options={RELATIONSHIP_OPTIONS}
        />
      </Flex>
    </EditCard>
  );
}
