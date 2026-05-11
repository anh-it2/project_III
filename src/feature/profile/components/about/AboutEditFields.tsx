"use client";

import { Flex } from "antd";
import { useWatch } from "react-hook-form";
import type { FieldDef } from "../../data/mock";
import { AboutEditField } from "./AboutEditField";

interface AboutEditFieldsProps {
  fields: FieldDef[];
}

export function AboutEditFields({ fields }: AboutEditFieldsProps) {
  const watched = useWatch() ?? {};
  const record = watched as Record<string, unknown>;

  return (
    <Flex wrap="wrap" gap={12} className="!w-full">
      {fields.map((f) => {
        const hidden =
          f.hideWhen && record[f.hideWhen.name] === f.hideWhen.equals;
        if (hidden) return null;
        const widthClass = f.span === 1 ? "!w-[calc(50%-6px)]" : "!w-full";
        return (
          <div key={f.name} className={widthClass}>
            <AboutEditField field={f} />
          </div>
        );
      })}
    </Flex>
  );
}
