"use client";

import { useCallback, useEffect, useState } from "react";
import type { AboutRowData } from "../../../data/mock";

const STORAGE_KEY = "profile.about.rows.v1";

export type AboutDataMap = Record<string, AboutRowData[]>;

function loadFromStorage(): AboutDataMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as AboutDataMap;
    return {};
  } catch {
    return {};
  }
}

function saveToStorage(data: AboutDataMap) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
}

function makeId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useAboutData() {
  const [data, setData] = useState<AboutDataMap>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveToStorage(data);
  }, [data, hydrated]);

  const getRows = useCallback(
    (sectionId: string): AboutRowData[] => data[sectionId] ?? [],
    [data]
  );

  const addRow = useCallback(
    (sectionId: string, row: Omit<AboutRowData, "id">) => {
      setData((prev) => {
        const list = prev[sectionId] ?? [];
        return { ...prev, [sectionId]: [...list, { ...row, id: makeId() }] };
      });
    },
    []
  );

  const updateRow = useCallback(
    (sectionId: string, rowId: string, patch: Partial<AboutRowData>) => {
      setData((prev) => {
        const list = prev[sectionId] ?? [];
        return {
          ...prev,
          [sectionId]: list.map((r) => (r.id === rowId ? { ...r, ...patch } : r)),
        };
      });
    },
    []
  );

  const deleteRow = useCallback((sectionId: string, rowId: string) => {
    setData((prev) => {
      const list = prev[sectionId] ?? [];
      return { ...prev, [sectionId]: list.filter((r) => r.id !== rowId) };
    });
  }, []);

  return { data, hydrated, getRows, addRow, updateRow, deleteRow };
}
