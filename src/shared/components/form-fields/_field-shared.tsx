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
