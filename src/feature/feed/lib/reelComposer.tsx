"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export interface ReelComposerInitial {
  mediaUrl: string;
  mediaType: "video" | "image";
  caption?: string;
}

interface ReelComposerContextValue {
  open: boolean;
  initial: ReelComposerInitial | undefined;
  openComposer: (initial?: ReelComposerInitial) => void;
  closeComposer: () => void;
}

const ReelComposerContext = createContext<ReelComposerContextValue | null>(null);

export function ReelComposerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initial, setInitial] = useState<ReelComposerInitial | undefined>(undefined);

  const openComposer = useCallback((next?: ReelComposerInitial) => {
    setInitial(next);
    setOpen(true);
  }, []);

  const closeComposer = useCallback(() => {
    setOpen(false);
    setInitial(undefined);
  }, []);

  return (
    <ReelComposerContext.Provider value={{ open, initial, openComposer, closeComposer }}>
      {children}
    </ReelComposerContext.Provider>
  );
}

export function useReelComposer() {
  return useContext(ReelComposerContext);
}
