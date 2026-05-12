"use client";

import { Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import {
  FieldErrorText,
  RequiredAsterisk,
  getLabelCls,
} from "./_field-shared";
import styles from "./RHFTextArea.module.scss";
import type { TextAreaProps } from "./types";

export function RHFTextArea({
  name,
  label,
  placeholder,
  isRequire = false,
  disabled = false,
  autoComplete = "off",
  className,
  rows = 3,
  maxLength,
  showCount = false,
}: TextAreaProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1.5">
          {label && (
            <label htmlFor={name} className={getLabelCls(fieldState.invalid)}>
              <span className="inline-flex items-center gap-1">
                {label}
                {isRequire && <RequiredAsterisk />}
              </span>
            </label>
          )}
          <Input.TextArea
            {...field}
            id={name}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            status={fieldState.invalid ? "error" : ""}
            rows={rows}
            maxLength={maxLength}
            showCount={showCount}
            className={`${styles.field} ${className ?? ""}`}
          />
          <FieldErrorText
            invalid={fieldState.invalid}
            message={fieldState.error?.message}
          />
        </div>
      )}
    />
  );
}
