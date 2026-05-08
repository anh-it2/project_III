export function RequiredAsterisk() {
  return <span className="text-[var(--color-error)]">*</span>;
}

export function getLabelCls(invalid: boolean) {
  return invalid
    ? "text-[14px] font-medium text-[var(--color-error)]"
    : "text-[14px] font-medium text-[var(--color-text-secondary)]";
}

export function getIconCls(invalid: boolean) {
  return invalid
    ? "absolute pointer-events-none text-[20px] text-[var(--color-error)]"
    : "absolute pointer-events-none text-[20px] text-[var(--color-text-placeholder)]";
}

export const INPUT_TEMPLATE_CLASS = [
  "!h-12 !rounded-[10px] !px-4 !py-0 !text-[15px]",
  "!bg-white dark:!bg-[var(--color-bg-tertiary)]",
  "!border !border-[var(--color-border)]",
  "hover:!border-[var(--color-primary)]",
  "focus-within:!border-[var(--color-primary)]",
  "focus-within:!shadow-[0_0_0_2px_rgba(24,119,242,0.15)]",
  "[&_input]:!bg-transparent [&_input]:!text-[15px]",
  "[&_input]:!text-[var(--color-text)]",
  "[&_input::placeholder]:!text-[var(--color-text-placeholder)]",
  "[&_.ant-input-prefix]:!me-2.5",
  "[&_.ant-input-prefix_.anticon]:!text-[var(--color-text-placeholder)]",
  "[&_.ant-input-prefix_.anticon]:!text-[18px]",
  "[&_.ant-input-suffix_.anticon]:!text-[var(--color-text-placeholder)]",
  "[&_.ant-input-suffix_.anticon]:!text-[18px]",
].join(" ");

export function FieldErrorText({
  invalid,
  message,
}: {
  invalid: boolean;
  message?: string;
}) {
  if (!invalid || !message) return null;
  return (
    <span className="mt-1 text-[12px] text-[var(--color-error)]">
      {message}
    </span>
  );
}
