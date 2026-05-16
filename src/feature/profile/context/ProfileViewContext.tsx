"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { pickGradient } from "@/feature/chat/lib/avatar";
import { useFriendsBootstrap } from "@/feature/friends/hooks/useFriends";
import { useFriendsStore } from "@/feature/friends/stores/friends.store";

export interface ProfileView {
  /** true = the logged-in user's own profile (/profile) */
  isSelf: boolean;
  /** other person's user id when !isSelf */
  personId?: string;
  /** display name (only set for other people; self uses useProfileMeta) */
  name?: string;
  location?: string;
  bio?: string;
  /** avatar gradient + initial for other people (they have no uploaded pic) */
  gradient?: [string, string];
  initial?: string;
}

const Ctx = createContext<ProfileView>({ isSelf: true });

export function ProfileViewProvider({
  personId,
  children,
}: {
  personId?: string;
  children: ReactNode;
}) {
  useFriendsBootstrap();
  const person = useFriendsStore((s) =>
    personId ? s.people[personId] : undefined,
  );

  const value = useMemo<ProfileView>(() => {
    if (!personId) return { isSelf: true };
    const name = person?.name ?? personId;
    return {
      isSelf: false,
      personId,
      name,
      location: person?.location,
      bio: person?.reason,
      gradient: pickGradient(personId),
      initial: (name.trim()[0] ?? "?").toUpperCase(),
    };
  }, [personId, person]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProfileView(): ProfileView {
  return useContext(Ctx);
}
