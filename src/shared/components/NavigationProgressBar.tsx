"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { useNavigationStore } from "@/shared/stores/navigation.store";
import styles from "./NavigationProgressBar.module.scss";

export function NavigationProgressBar() {
  const isNavigating = useNavigationStore((s) => s.isNavigating);
  const setNavigating = useNavigationStore((s) => s.setNavigating);
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isNavigating) setActive(true);
  }, [isNavigating]);

  useEffect(() => {
    if (!active) return;
    setNavigating(false);
    const t = setTimeout(() => setActive(false), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return <div className={`${styles.bar} ${active ? styles.active : ""}`} />;
}
