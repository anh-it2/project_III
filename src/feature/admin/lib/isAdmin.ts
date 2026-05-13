export function isAdminUserName(userName: string | undefined | null): boolean {
  if (!userName) return false;
  return userName.toLowerCase().startsWith("admin");
}
