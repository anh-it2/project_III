"use client";

import { Checkbox } from "antd";
import type { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FieldErrorText } from "./_field-shared";
import styles from "./RHFCheckbox.module.scss";

export interface RHFCheckboxProps {
  name: string;
  label: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function RHFCheckbox({
  name,
  label,
  disabled = false,
  className,
}: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1">
          <Checkbox
            checked={Boolean(field.value)}
            onChange={(e) => field.onChange(e.target.checked)}
            onBlur={field.onBlur}
            disabled={disabled}
            className={`${styles.field} ${className ?? ""}`}
          >
            <span className={styles.label}>{label}</span>
          </Checkbox>
          <FieldErrorText
            invalid={fieldState.invalid}
            message={fieldState.error?.message}
          />
        </div>
      )}
    />
  );
}
