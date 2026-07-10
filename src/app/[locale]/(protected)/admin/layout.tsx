"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { isAdminRole } from "@/feature/admin/lib/isAdmin";
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
  const role = useAuthStore((s) => s.role);
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const hydrated = useAuthHydrated();
  const isAdmin = isAdminRole(role);

  useEffect(() => {
    if (hydrated && isLoggined && !isAdmin) router.replace("/");
  }, [hydrated, isLoggined, isAdmin, router]);

  if (!hydrated || !isLoggined || !isAdmin) return null;
  return <>{children}</>;
}
