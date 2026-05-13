import { create } from "zustand";
import type { Report, ReportStatus } from "../types";

interface ReportState {
  reports: Report[];
  setAll: (list: Report[]) => void;
  addOne: (r: Report) => void;
  removeOne: (id: string) => void;
  setStatus: (id: string, status: ReportStatus) => void;
  pendingCount: () => number;
}

export const useReportStore = create<ReportState>()((set, get) => ({
  reports: [],

  setAll: (list) => set({ reports: list }),

  addOne: (r) =>
    set((state) => {
      if (state.reports.some((x) => x.id === r.id)) return state;
      return { reports: [r, ...state.reports] };
    }),

  removeOne: (id) =>
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== id),
    })),

  setStatus: (id, status) =>
    set((state) => ({
      reports: state.reports.map((r) =>
        r.id === id ? { ...r, status } : r,
      ),
    })),

  pendingCount: () =>
    get().reports.filter((r) => r.status === "pending").length,
}));
