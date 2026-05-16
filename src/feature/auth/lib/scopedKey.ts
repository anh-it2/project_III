"use client";

/**
 * Per-account localStorage key. Profile / feed data must not bleed across
 * accounts: scope every key by the logged-in user id (empty → "guest").
 * `userId` is read reactively by callers (e.g. `useAuthStore(s => s.userId)`)
 * so storage re-hydrates on account switch.
 */
export function scopedKey(base: string, userId: string): string {
  return `${base}::${userId || "guest"}`;
}
