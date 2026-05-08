"use client";

import { Flex } from "antd";
import { RHFTextField } from "@/shared/components/form-fields/RHFTextField";
import { EditCard } from "./EditCard";

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
        <RHFTextField
          name="relationship"
          label="Relationship"
          placeholder="e.g. Single"
        />
      </Flex>
    </EditCard>
  );
}
