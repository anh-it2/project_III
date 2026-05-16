"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { scopedKey } from "@/feature/auth/lib/scopedKey";
import { EDIT_PROFILE_DEFAULTS } from "./edit-profile.constants";
import type { EditProfileValues } from "./edit-profile.schema";

const STORAGE_KEY = "profile.meta.v1";

function loadFromStorage(
  userId: string,
  userName: string,
): EditProfileValues {
  // Fresh account: no stored meta → start from defaults, seed the name
  // from the auth store so the profile reflects the logged-in user.
  const seeded = { ...EDIT_PROFILE_DEFAULTS, name: userName };
  if (typeof window === "undefined") return seeded;
  try {
    const raw = window.localStorage.getItem(scopedKey(STORAGE_KEY, userId));
    if (!raw) return seeded;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const merged = {
        ...EDIT_PROFILE_DEFAULTS,
        ...(parsed as Partial<EditProfileValues>),
      };
      return { ...merged, name: merged.name || userName };
    }
    return seeded;
  } catch {
    return seeded;
  }
}

function saveToStorage(userId: string, data: EditProfileValues) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      scopedKey(STORAGE_KEY, userId),
      JSON.stringify(data),
    );
  } catch {
    /* ignore quota errors */
  }
}

export function useProfileMeta() {
  const userId = useAuthStore((s) => s.userId);
  const userName = useAuthStore((s) => s.userName);
  const [meta, setMeta] = useState<EditProfileValues>(EDIT_PROFILE_DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  // Re-hydrate whenever the account changes so the profile resets/loads
  // the right user's data instead of bleeding the previous account's.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMeta(loadFromStorage(userId, userName));
    setHydrated(true);
  }, [userId, userName]);

  const save = useCallback(
    (next: EditProfileValues) => {
      setMeta(next);
      saveToStorage(userId, next);
    },
    [userId],
  );

  return { meta, hydrated, save };
}
