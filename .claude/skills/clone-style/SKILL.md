---
name: clone-style
description: Styling conventions for this Next.js + Tailwind 4 + Ant Design project. Use this skill when writing or editing any UI component, page, or styling. Triggers on phrases like "style this", "add styling", "create page", "create component", "build UI", "/clone-style", or any UI/CSS/Tailwind/SCSS work in this repo.
---

# clone-style — Project styling rules

Apply these rules to **every** UI change. Order matters: try Tailwind first, then SCSS module, never raw `<style>`, and never inline `style` for a value that is static.

## 1. Styling priority

1. **Tailwind utility classes** — default for layout, spacing, sizing, flex, grid, typography, simple hover. This includes **static CSS-variable values**: write `className="bg-[var(--color-bg-secondary)] text-[var(--color-text)]"`, not `style={{ background: "var(--color-bg-secondary)" }}`. For props with no idiomatic utility use Tailwind's arbitrary-property form `[border-color:var(--color-border)]`, `[white-space:pre-wrap]` (spaces → `_`).
2. **CSS Modules (`.module.scss`)** — only when Tailwind cannot express it (deep antd `:global(.ant-...)` selectors, complex `&:hover` chains, keyframes, `:has()` cascades).
3. **Inline `style={{ ... }}`** — **only** for values that depend on JS at runtime (gradient computed from data, measured/computed dimensions, a CSS var whose name is chosen by a prop/state). If every value is a string/number literal it is static → it must be a Tailwind class, not inline `style`.
4. **Never** use a raw `<style>{`...`}</style>` JSX tag. If global CSS is required, put it in `globals.css` or a `.module.scss` file.

### Global stylesheet — `src/app/globals.css`

The global entry is **`src/app/globals.css`** (plain CSS), imported once in `src/app/[locale]/layout.tsx`. It holds the Tailwind entry, `:root` / `.dark` CSS-variable definitions, `@theme inline`, antd global overrides, keyframes. First line is:

```css
@import "tailwindcss";
```

Keep this file `.css` — do **not** rename it to `.scss`. Tailwind v4 is a CSS-first build tool; routing the global entry through sass-loader (`.scss`) makes sass run before `@tailwindcss/postcss` and breaks the Tailwind directives (`@import "tailwindcss"`, `@custom-variant`, `@theme inline`) — Dart Sass `@import` deprecation, then "Parsing CSS source code failed". Component-scoped styles still use `*.module.scss`; only the global entry stays `.css`.

## 2. Colors must use CSS variables

The project supports light + dark themes via CSS custom properties defined in `src/app/globals.css`. **Never hardcode hex/rgb colors for theme-aware surfaces.** Use the variables below.

| Variable | Use for |
|---|---|
| `--color-bg` | App-level background |
| `--color-bg-secondary` | Cards, panels, modals, top nav |
| `--color-bg-tertiary` | Hover states, input fields, chips |
| `--color-text` | Primary text |
| `--color-text-secondary` | Secondary text, icons |
| `--color-text-muted` | Muted/meta text, placeholders |
| `--color-text-placeholder` | Input placeholders |
| `--color-border` | Borders, dividers |
| `--color-border-light` | Subtle borders |
| `--color-primary` / `--color-primary-dark` / `--color-primary-light` / `--color-primary-bg` / `--color-on-primary` | Brand actions |
| `--color-success` / `--color-warning` / `--color-error` | Status colors |

```tsx
// good — static var values as Tailwind classes
<div className="bg-[var(--color-bg-secondary)] text-[var(--color-text)]" />

// bad — static value as inline style (see §1.3)
<div style={{ background: "var(--color-bg-secondary)", color: "var(--color-text)" }} />

// bad — locks color to one theme
<div style={{ background: "#fafbfc", color: "#1a1a2e" }} />

// ok — inline style only because the var name is chosen at runtime
<div style={{ background: `var(--color-${tone})` }} />
```

Brand-specific gradients/decorations that must look the same in both themes (logo, avatar gradients) may use literal colors via `gradientBg([...])`.

## 3. Tailwind: arbitrary values + `!` important for antd overrides

Antd injects its own classes; sometimes Tailwind utilities are outranked. The project convention is the **`!` prefix** form (`!h-10`, `!w-10`, `!rounded-full`) — keep using it when overriding antd, even though Tailwind v4 also supports `class!` suffix. Match existing files.

```tsx
<Button className="!h-10 !w-10 !rounded-[10px] !p-0" />
```

For one-off pixel values use Tailwind's arbitrary-value syntax: `!h-[72px]`, `!w-[min(380px,calc(100vw-16px))]`, `!right-[344px]`.

Responsive: `sm:`, `md:`, `lg:`, `xl:` breakpoints. Mobile-first.

## 4. SCSS module pattern

Create `<Component>.module.scss` next to the component. Import as `styles`. Wrap antd internals with `:global(...)`.

```scss
// PostHeader.module.scss
.moreBtn {
  &:hover {
    background: var(--color-bg-tertiary) !important;
  }
}

.confirmModal {
  :global(.ant-modal-content) {
    background: var(--color-bg-secondary) !important;
    border: 1px solid var(--color-border);
    border-radius: 12px;
  }
}
```

```tsx
import styles from "./PostHeader.module.scss";

<Button className={`${styles.moreBtn} !h-9 !w-9`} />
<Modal rootClassName={styles.confirmModal} />
```

Reuse modules across siblings when the rule is generic (e.g. `topnav/NavBtn.module.scss` exposes `.hoverBg` used by ChatNavBtn / NotificationNavBtn / ThemeNavBtn / NavBtn).

## 5. Modals — use the shared `DarkModal` + `ConfirmModal`

- `src/shared/components/modal/DarkModal.tsx` — base. Accepts `bg` and `borderColor` props that flow into `--dark-modal-bg` / `--dark-modal-border` CSS vars used by its scss module.
- `src/shared/components/modal/ConfirmModal.tsx` — theme-aware confirm dialog (icon, title, description, ok/cancel). Use this for any destructive action prompt — **do not use `Modal.confirm` from antd directly**, since it bypasses theme styling.

```tsx
<ConfirmModal
  open={open}
  title="Remove this post?"
  description="This will be permanently removed."
  okText="Remove"
  danger
  onOk={onRemove}
  onCancel={() => setOpen(false)}
/>
```

For full custom dialogs:

```tsx
<DarkModal open={...} bg="var(--color-bg-secondary)" borderColor="var(--color-border)" />
```

## 6. Forms — use shared RHF wrappers

All forms use **react-hook-form** (`FormProvider` + `useForm`) with **zod** validation via `zodResolver`. Form inputs render through shared `RHF*` wrappers in `src/shared/components/form-fields/` — never call antd `Input`/`Select`/`DatePicker`/`Checkbox` directly inside a form.

### Existing wrappers (check before creating)

| Kind | Component | Antd primitive |
|---|---|---|
| Text input | `RHFTextField` | `Input` |
| Password | `RHFPasswordField` | `Input.Password` |
| Multiline | `RHFTextArea` | `Input.TextArea` |
| Select / enum | `RHFSelect` | `Select` |
| Boolean | `RHFCheckbox` | `Checkbox` |
| Date / Month / Year | `RHFDatePicker` | `DatePicker` |

If the field kind you need is missing, create `RHF<Kind>.tsx` next to the others — **do not inline a raw antd field inside a form**.

### Wrapper pattern (when creating a new one)

Copy the structure from `RHFTextField.tsx`:

- `"use client"`, then `Controller` + `useFormContext` from `react-hook-form`.
- Props from `./types.ts` (`name`, `label`, `placeholder`, `isRequire`, `disabled`, `className`, …). Add kind-specific props.
- Render: `<label>` using `getLabelCls(fieldState.invalid)` → label text + `<RequiredAsterisk />` when `isRequire`.
- The antd primitive itself, themed via Tailwind tokens that already exist in `_field-shared.tsx` (`INPUT_TEMPLATE_CLASS` for text-style, the local `TEXTAREA_CLASS` / `PICKER_CLASS` / `SELECT_CLASS` for others) — `!h-12 !rounded-[10px]`, `dark:!bg-[var(--color-bg-tertiary)]`, `!text-[var(--color-text)]`, placeholder + caret via `[&_input::placeholder]:!text-[var(--color-text-placeholder)]` etc. Forward `status={fieldState.invalid ? "error" : ""}`.
- `<FieldErrorText invalid={fieldState.invalid} message={fieldState.error?.message} />` below.
- For non-text primitives (Select/DatePicker): bridge form state ↔ antd value/onChange manually. For `RHFDatePicker`, store the value as an **ISO string** (`d.toISOString()`) and convert back with `dayjs(value)` so persistence is plain text and zod can validate as `z.string()`.

### Form composition pattern

```tsx
const methods = useForm<FormValues>({
  resolver: zodResolver(buildZodSchema(fields)) as unknown as Resolver<FormValues>,
  defaultValues: buildDefaults(fields, initial?.values),
  mode: "onSubmit",
});

<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(onValid)} noValidate>
    {/* RHF fields here */}
  </form>
</FormProvider>
```

For schema-driven forms (fields described in data, not hard-coded), split the modal into pieces — see [AboutRowEditModal.tsx](src/feature/profile/components/about/AboutRowEditModal.tsx) for the canonical split:

- `aboutEditForm.utils.ts` — `buildDefaults`, `buildZodSchema` (with `superRefine` for conditional `required`), `cleanValues`.
- `AboutEditField.tsx` — single field switch on `kind`.
- `AboutEditFields.tsx` — list renderer; uses `useWatch()` for `hideWhen` conditional fields + `span: 1` half-width layout.
- `AboutEditFooter.tsx` — Cancel / Save buttons.
- `AboutRowEditModal.tsx` — shell only: `DarkModal` + `FormProvider` + title + error banner.

### Required-field UX (must-have)

1. **Asterisk** — `<RequiredAsterisk />` (red `*`) beside every required label. Driven by `isRequire` prop on the wrapper.
2. **Label color** flips to `--color-error` when the field is invalid (handled by `getLabelCls`).
3. **Inline error** under the field via `FieldErrorText` (red 12px text).
4. **Form-level banner** under all fields when `Object.keys(formState.errors).length > 0`: e.g. *"Please fill out the required fields marked with *."* — gives the user one visible nudge after a failed submit even if the offending field has scrolled away.
5. Conditional required: if a field has `hideWhen`, validate it only when visible. Use zod `superRefine` to skip hidden fields rather than `z.string().min(1)`, otherwise hidden fields fail submit.

## 7. Components: prefer Ant Design over raw HTML

For new pages and components, reach for `antd` first:

| Need | Use |
|---|---|
| Button | `Button` (`type="text"` / `"primary"`, `shape="circle"`) |
| Layout row/col | `Flex`, `Row`/`Col` |
| Text | `Typography.Text` / `Typography.Title` |
| Form input | `Input`, `Input.TextArea`, `Input.Search` |
| Dropdowns | `Dropdown` with `menu={{ items, style }}` (but see §7) |
| Badge / Tag | `Badge`, `Tag` |
| Avatar | `Avatar` |
| Modal / Popover / Tooltip | `Modal` (via `DarkModal`/`ConfirmModal`), `Popover`, `Tooltip` |
| Upload | `Upload`, `Upload.Dragger` |

Use raw `<div>`, `<span>`, `<button>` only when antd has no equivalent or the element is a pure visual primitive (decorative dot, gradient background, absolute-positioned overlay).

Icons: `<Icon name="..." />` from `@/shared/components/Icon` (Material Symbols Rounded). Pass `color="var(--color-text-secondary)"` etc.

## 8. Header dropdowns — bypass antd `Dropdown` for viewport-anchored panels

Antd `Dropdown` anchors to its trigger. On narrow viewports, panels anchored to a far-right trigger overflow off-screen. Pattern used by ChatNavBtn / NotificationNavBtn:

- Manage `open` state manually.
- Render the panel as a sibling `<div>` with `!fixed !top-14 !right-2 sm:!right-4 lg:!right-8 !z-[1000]`.
- Cap panel width: `!w-[min(360px,calc(100vw-16px))]`.
- Add a `useEffect` for `mousedown` outside + `Escape` to close.

## 9. Responsive sidebars on Feed/Chat layouts

- Hide left sidebar `<lg`, hide right sidebar `<xl`. Center column uses `!mx-auto !max-w-[680px]` below lg, full width at lg+.
- Chat boxes: `right-2` mobile, `sm:right-6`, `xl:right-[344px]` (clears right sidebar). Cap width `calc(100vw-16px)` mobile, `328px` `sm+`. Hide siblings beyond first on mobile via `[&>*:nth-child(n+2)]:!hidden sm:[&>*:nth-child(n+2)]:!flex`.

## 10. Quick checklist before finishing a UI change

- [ ] No hardcoded colors for theme surfaces — used `var(--color-*)`.
- [ ] No `<style>{...}</style>` JSX tags introduced. SCSS module if Tailwind insufficient.
- [ ] No inline `style` for static values — only runtime-dynamic ones. Static var values are Tailwind classes (`bg-[var(--color-*)]` / arbitrary-property form).
- [ ] Global entry stays `src/app/globals.css` (`.css`, not `.scss`) with `@import "tailwindcss";`.
- [ ] Antd component used where one exists.
- [ ] Form fields go through shared `RHF*` wrappers — created a new wrapper if a kind was missing instead of inlining antd.
- [ ] Required fields show `*`, invalid state turns label/border red, inline error appears, and a form-level banner shows after a failed submit.
- [ ] Tested visually in both light and dark modes (toggle via theme button).
- [ ] Mobile / tablet / desktop checked at `sm` / `lg` / `xl` breakpoints.
- [ ] `npx tsc --noEmit` clean for touched files.
