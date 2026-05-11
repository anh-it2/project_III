"use client";

import { RHFCheckbox } from "@/shared/components/form-fields/RHFCheckbox";
import { RHFDatePicker } from "@/shared/components/form-fields/RHFDatePicker";
import { RHFSelect } from "@/shared/components/form-fields/RHFSelect";
import { RHFTextArea } from "@/shared/components/form-fields/RHFTextArea";
import { RHFTextField } from "@/shared/components/form-fields/RHFTextField";
import type { FieldDef } from "../../../data/mock";

interface AboutEditFieldProps {
  field: FieldDef;
}

export function AboutEditField({ field }: AboutEditFieldProps) {
  switch (field.kind) {
    case "text":
      return (
        <RHFTextField
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          isRequire={field.required}
        />
      );
    case "textarea":
      return (
        <RHFTextArea
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          isRequire={field.required}
          rows={3}
        />
      );
    case "select":
      return (
        <RHFSelect
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          options={field.options ?? []}
          isRequire={field.required}
        />
      );
    case "checkbox":
      return <RHFCheckbox name={field.name} label={field.label} />;
    case "date":
      return (
        <RHFDatePicker
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
          isRequire={field.required}
          picker={field.pickerKind ?? "month"}
          minYear={field.minYear}
          maxYear={field.maxYear}
        />
      );
    default:
      return null;
  }
}
