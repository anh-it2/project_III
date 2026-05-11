"use client";

import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FieldErrorText,
  RequiredAsterisk,
  getLabelCls,
} from "./_field-shared";
import styles from "./RHFDatePicker.module.scss";

type PickerKind = "date" | "month" | "year";

export interface RHFDatePickerProps {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  isRequire?: boolean;
  disabled?: boolean;
  className?: string;
  picker?: PickerKind;
  format?: string;
  minYear?: number;
  maxYear?: number;
}

function toDayjs(value: unknown): Dayjs | null {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number") {
    const d = dayjs(value);
    return d.isValid() ? d : null;
  }
  if (dayjs.isDayjs(value)) return value;
  return null;
}

export function RHFDatePicker({
  name,
  label,
  placeholder,
  isRequire = false,
  disabled = false,
  className,
  picker = "date",
  format,
  minYear,
  maxYear,
}: RHFDatePickerProps) {
  const { control } = useFormContext();
  const defaultFormat =
    picker === "year"
      ? "YYYY"
      : picker === "month"
        ? "MMMM YYYY"
        : "MMM D, YYYY";

  const disabledDate = (current: Dayjs) => {
    if (!current) return false;
    const y = current.year();
    if (minYear && y < minYear) return true;
    if (maxYear && y > maxYear) return true;
    return false;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = toDayjs(field.value);
        return (
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
            <DatePicker
              id={name}
              value={value}
              onChange={(d) => field.onChange(d ? d.toISOString() : "")}
              onBlur={field.onBlur}
              disabled={disabled}
              placeholder={placeholder}
              picker={picker}
              format={format ?? defaultFormat}
              status={fieldState.invalid ? "error" : ""}
              disabledDate={
                minYear || maxYear ? disabledDate : undefined
              }
              classNames={{ popup: { root: styles.popup } }}
              className={`${styles.field} ${className ?? ""}`}
              size="large"
            />
            <FieldErrorText
              invalid={fieldState.invalid}
              message={fieldState.error?.message}
            />
          </div>
        );
      }}
    />
  );
}
