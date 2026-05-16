"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { FriendStatus, PersonDTO } from "../dto/friends.dto";

interface FriendsState {
  /** id -> person catalog (name, mutuals, etc.) */
  people: Record<string, PersonDTO>;
  /** id -> my relationship to them */
  status: Record<string, FriendStatus>;
  /** notification ids of friend-requests already materialized (dedupe) */
  processedRequests: Record<string, true>;

  /** Internal mutators — call these from the service adapter only. */
  _upsertPerson: (person: PersonDTO) => void;
  _setStatus: (id: string, status: FriendStatus) => void;
  /**
   * Materialize an incoming friend request that arrived as a
   * `friend_request` notification. Idempotent per notification id (so the
   * notification:list replay on every reconnect can't resurrect a request
   * the user already accepted/rejected). Only creates the edge when there
   * is no existing relationship.
   */
  _ingestFriendRequest: (
    notificationId: string,
    actorId: string,
    actorName: string,
  ) => void;
  /**
   * Reconcile the sender side when the recipient resolves the request the
   * other way: a `friend_accept`/`friend_reject` notification arrives back.
   * "accepted" -> the edge becomes "friends"; "rejected" -> a still-pending
   * "requested" edge is cleared to "none". Idempotent per notification id.
   */
  _ingestFriendResolution: (
    notificationId: string,
    actorId: string,
    actorName: string,
    outcome: "accepted" | "rejected",
  ) => void;
}

export const useFriendsStore = create<FriendsState>()(
  persist(
    (set) => ({
      people: {},
      status: {},
      processedRequests: {},

      _upsertPerson: (person) =>
        set((st) => ({ people: { ...st.people, [person.id]: person } })),

      _setStatus: (id, status) =>
        set((st) => ({ status: { ...st.status, [id]: status } })),

      _ingestFriendRequest: (notificationId, actorId, actorName) =>
        set((st) => {
          if (st.processedRequests[notificationId]) return st;
          const processedRequests = {
            ...st.processedRequests,
            [notificationId]: true as const,
          };
          // Mark processed regardless; only create the edge when there is
          // no existing relationship (don't clobber friends/requested).
          if ((st.status[actorId] ?? "none") !== "none") {
            return { processedRequests };
          }
          const person: PersonDTO = st.people[actorId] ?? {
            id: actorId,
            name: actorName,
            mutualFriends: 0,
          };
          return {
            processedRequests,
            people: { ...st.people, [actorId]: person },
            status: { ...st.status, [actorId]: "incoming" },
          };
        }),

      _ingestFriendResolution: (notificationId, actorId, actorName, outcome) =>
        set((st) => {
          if (st.processedRequests[notificationId]) return st;
          const processedRequests = {
            ...st.processedRequests,
            [notificationId]: true as const,
          };
          const cur = st.status[actorId] ?? "none";
          if (outcome === "rejected") {
            // Only clear a still-pending request; never undo a friendship.
            if (cur !== "requested") return { processedRequests };
            return {
              processedRequests,
              status: { ...st.status, [actorId]: "none" },
            };
          }
          // accepted -> become friends (idempotent if already friends).
          const person: PersonDTO = st.people[actorId] ?? {
            id: actorId,
            name: actorName,
            mutualFriends: 0,
          };
          return {
            processedRequests,
            people: { ...st.people, [actorId]: person },
            status: { ...st.status, [actorId]: "friends" },
          };
        }),
    }),
    {
      name: "friends-state",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        people: s.people,
        status: s.status,
        processedRequests: s.processedRequests,
      }),
    },
  ),
);

/** Status helper (defaults to "none" when unknown). */
export function statusOf(id: string): FriendStatus {
  return useFriendsStore.getState().status[id] ?? "none";
}
