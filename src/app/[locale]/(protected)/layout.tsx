"use client";

import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const [hydrated, setHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (hydrated) return;
    const unsub = useAuthStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    return () => unsub();
  }, [hydrated]);

  useEffect(() => {
    if (hydrated && !isLoggined) router.replace("/login");
  }, [hydrated, isLoggined, router]);

  if (!hydrated || !isLoggined) return null;
  return <>{children}</>;
}
