/**
 * Admin identity is the BE `role` claim (surfaced from /me into the auth
 * store), NOT a username heuristic. An admin is promoted out-of-band by
 * setting role = ADMIN on their User row.
 */
export function isAdminRole(role: string | undefined | null): boolean {
  return role === "ADMIN";
}
