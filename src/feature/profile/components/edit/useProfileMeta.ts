"use client";

import { useCallback, useEffect, useState } from "react";
import { EDIT_PROFILE_DEFAULTS } from "./edit-profile.constants";
import type { EditProfileValues } from "./edit-profile.schema";

const STORAGE_KEY = "profile.meta.v1";

function loadFromStorage(): EditProfileValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return { ...EDIT_PROFILE_DEFAULTS, ...(parsed as Partial<EditProfileValues>) };
    }
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(data: EditProfileValues) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
}

export function useProfileMeta() {
  const [meta, setMeta] = useState<EditProfileValues>(EDIT_PROFILE_DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMeta(loadFromStorage() ?? EDIT_PROFILE_DEFAULTS);
    setHydrated(true);
  }, []);

  const save = useCallback((next: EditProfileValues) => {
    setMeta(next);
    saveToStorage(next);
  }, []);

  return { meta, hydrated, save };
}
