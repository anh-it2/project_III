"use client";

import { Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import {
  FieldErrorText,
  RequiredAsterisk,
  getLabelCls,
} from "./_field-shared";
import type { TextAreaProps } from "./types";

const TEXTAREA_CLASS = [
  "!rounded-[10px] !text-[15px]",
  "!bg-white dark:!bg-[var(--color-bg-tertiary)]",
  "!border !border-[var(--color-border)]",
  "hover:!border-[var(--color-primary)]",
  "focus-within:!border-[var(--color-primary)]",
  "focus-within:!shadow-[0_0_0_2px_rgba(24,119,242,0.15)]",
  "!text-[var(--color-text)]",
  "[&_textarea]:!bg-transparent [&_textarea]:!text-[15px]",
  "[&_textarea]:!text-[var(--color-text)]",
  "[&_textarea]:!caret-[var(--color-text)]",
  "[&_textarea::placeholder]:!text-[var(--color-text-placeholder)]",
  "[&_.ant-input]:!bg-transparent",
  "[&_.ant-input]:!text-[var(--color-text)]",
  "[&_.ant-input::placeholder]:!text-[var(--color-text-placeholder)]",
].join(" ");

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
            className={`${TEXTAREA_CLASS} ${className ?? ""}`}
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
