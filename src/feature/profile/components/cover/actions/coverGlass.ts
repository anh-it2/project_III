// Cover action buttons sit on the fixed cover gradient, so they follow
// the frosted-glass language of the identity chips ("Open to collab").
// Pure Tailwind (clone-style §1). Every colour is a --cover-glass-* token
// (globals.css, light + dark, overridable by any future theme) — only the
// depth shadows are literal (universal, not palette).
//
// BASE has everything EXCEPT background + border-colour, so the secondary
// vs primary variants never emit two competing `!important` background
// utilities (Tailwind can't guarantee source order between them).

const BASE =
  "!text-[var(--cover-glass-fg)] !border !border-solid " +
  "[backdrop-filter:blur(14px)_saturate(140%)] " +
  "[-webkit-backdrop-filter:blur(14px)_saturate(140%)] " +
  "shadow-[0_1px_2px_rgba(0,0,0,0.45),0_4px_14px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.18)] " +
  "[text-shadow:0_1px_2px_rgba(0,0,0,0.6)] transition-colors duration-150";

/** Secondary glass pill (Share, More, non-primary friend states). */
export const COVER_GLASS =
  `${BASE} ` +
  "!bg-[var(--cover-glass-bg)] hover:!bg-[var(--cover-glass-bg-hover)] " +
  "!border-[color:var(--cover-glass-border)] " +
  "hover:!border-[color:var(--cover-glass-border-hover)]";

/** Primary glass pill (Message) — brand-tinted, mirrors .statusChip. */
export const COVER_GLASS_PRIMARY =
  `${BASE} ` +
  "!bg-[var(--cover-glass-primary-bg)] " +
  "hover:!bg-[var(--cover-glass-primary-bg-hover)] " +
  "!border-[color:var(--cover-glass-primary-border)] " +
  "hover:!border-[color:var(--cover-glass-primary-border-hover)]";

/** Icon/text colour token for content inside a cover glass button. */
export const COVER_GLASS_FG = "var(--cover-glass-fg)";
