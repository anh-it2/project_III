"use client";

import { Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import {
  FieldErrorText,
  INPUT_TEMPLATE_CLASS,
  RequiredAsterisk,
  getLabelCls,
} from "./_field-shared";
import type { Props } from "./types";

export function RHFPasswordField({
  name,
  label,
  placeholder,
  prefixIcon,
  isRequire = false,
  disabled = false,
  autoComplete = "current-password",
  className,
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="flex flex-col gap-1.5">
          {label && (
            <label
              htmlFor={name}
              className={getLabelCls(fieldState.invalid)}
            >
              <span className="inline-flex items-center gap-1">
                {label}
                {isRequire && <RequiredAsterisk />}
              </span>
            </label>
          )}
          <Input.Password
            {...field}
            id={name}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            status={fieldState.invalid ? "error" : ""}
            prefix={prefixIcon}
            size="large"
            className={`${INPUT_TEMPLATE_CLASS} ${className ?? ""}`}
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
