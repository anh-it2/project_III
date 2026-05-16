"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { scopedKey } from "@/feature/auth/lib/scopedKey";
import type { AboutRowData } from "../../../data/mock";

const STORAGE_KEY = "profile.about.rows.v1";

export type AboutDataMap = Record<string, AboutRowData[]>;

function loadFromStorage(userId: string): AboutDataMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(scopedKey(STORAGE_KEY, userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as AboutDataMap;
    return {};
  } catch {
    return {};
  }
}

function saveToStorage(userId: string, data: AboutDataMap) {
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

function makeId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useAboutData() {
  const userId = useAuthStore((s) => s.userId);
  // Data carries the account it was loaded under so an account switch
  // can't write the previous user's rows into the new scope.
  const [state, setState] = useState<{ scope: string; data: AboutDataMap }>({
    scope: userId,
    data: {},
  });
  const [hydrated, setHydrated] = useState(false);
  const data = state.data;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ scope: userId, data: loadFromStorage(userId) });
    setHydrated(true);
  }, [userId]);

  useEffect(() => {
    if (hydrated && state.scope === userId) saveToStorage(userId, state.data);
  }, [state, hydrated, userId]);

  const getRows = useCallback(
    (sectionId: string): AboutRowData[] => data[sectionId] ?? [],
    [data]
  );

  const addRow = useCallback(
    (sectionId: string, row: Omit<AboutRowData, "id">) => {
      setState((prev) => {
        const list = prev.data[sectionId] ?? [];
        return {
          ...prev,
          data: {
            ...prev.data,
            [sectionId]: [...list, { ...row, id: makeId() }],
          },
        };
      });
    },
    []
  );

  const updateRow = useCallback(
    (sectionId: string, rowId: string, patch: Partial<AboutRowData>) => {
      setState((prev) => {
        const list = prev.data[sectionId] ?? [];
        return {
          ...prev,
          data: {
            ...prev.data,
            [sectionId]: list.map((r) =>
              r.id === rowId ? { ...r, ...patch } : r,
            ),
          },
        };
      });
    },
    []
  );

  const deleteRow = useCallback((sectionId: string, rowId: string) => {
    setState((prev) => {
      const list = prev.data[sectionId] ?? [];
      return {
        ...prev,
        data: { ...prev.data, [sectionId]: list.filter((r) => r.id !== rowId) },
      };
    });
  }, []);

  return { data, hydrated, getRows, addRow, updateRow, deleteRow };
}
