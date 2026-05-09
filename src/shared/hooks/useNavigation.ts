"use client";

import { useEffect, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useNavigationStore } from "@/shared/stores/navigation.store";

type RouterLike = ReturnType<typeof useRouter>;
type NavigateOptions = Parameters<RouterLike["push"]>[1];

export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const setNavigating = useNavigationStore((s) => s.setNavigating);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setNavigating(isPending);
  }, [isPending, setNavigating]);

  function push(href: string, options?: NavigateOptions) {
    if (href === pathname) return;
    setNavigating(true);
    startTransition(() => {
      router.push(href, options);
    });
  }

  function replace(href: string, options?: NavigateOptions) {
    if (href === pathname) return;
    setNavigating(true);
    startTransition(() => {
      router.replace(href, options);
    });
  }

  function refresh() {
    setNavigating(true);
    startTransition(() => {
      router.refresh();
    });
  }

  return { push, replace, refresh, isPending };
}
