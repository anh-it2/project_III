"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { isAdminUserName } from "@/feature/admin/lib/isAdmin";
import { useRouter } from "@/i18n/navigation";

function useAuthHydrated() {
  return useSyncExternalStore(
    (cb) => useAuthStore.persist.onFinishHydration(cb),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const userName = useAuthStore((s) => s.userName);
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const hydrated = useAuthHydrated();
  const isAdmin = isAdminUserName(userName);

  useEffect(() => {
    if (hydrated && isLoggined && !isAdmin) router.replace("/");
  }, [hydrated, isLoggined, isAdmin, router]);

  if (!hydrated || !isLoggined || !isAdmin) return null;
  return <>{children}</>;
}
