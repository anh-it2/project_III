"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { connectManager, disposeAll } from "./manager";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import {
  disposePresence,
  initPresence,
} from "@/feature/presence/socket";
import { disposeChat, initChat } from "@/feature/chat/socket";
import {
  disposeNotification,
  initNotification,
} from "@/feature/notification/socket";
import {
  disposeReport,
  initReport,
} from "@/feature/admin/socket";

function useAuthReady() {
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const hydrated = useSyncExternalStore(
    (cb) => useAuthStore.persist.onFinishHydration(cb),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
  return { isLoggined, hydrated };
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { isLoggined, hydrated } = useAuthReady();

  useEffect(() => {
    if (!hydrated) return;
    if (isLoggined) {
      connectManager();
      initPresence();
      initChat();
      initNotification();
      initReport();
    } else {
      disposePresence();
      disposeChat();
      disposeNotification();
      disposeReport();
      disposeAll();
    }
  }, [hydrated, isLoggined]);

  return <>{children}</>;
}
