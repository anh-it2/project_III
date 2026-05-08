import type { ComponentType, ReactNode } from "react";

export type Props = {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  type?: string;
  icon?: ComponentType<{ className?: string }>;
  prefixIcon?: ReactNode;
  isRequire?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
};

export type TextAreaProps = {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  isRequire?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
};
