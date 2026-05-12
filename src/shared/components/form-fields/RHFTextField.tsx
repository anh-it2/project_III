"use client";

import { Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import {
  FieldErrorText,
  RequiredAsterisk,
  getLabelCls,
} from "./_field-shared";
import styles from "./RHFTextField.module.scss";
import type { Props } from "./types";

export function RHFTextField({
  name,
  label,
  placeholder,
  type = "text",
  prefixIcon,
  isRequire = false,
  disabled = false,
  autoComplete = "off",
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
          <Input
            {...field}
            id={name}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            status={fieldState.invalid ? "error" : ""}
            prefix={prefixIcon}
            size="large"
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
