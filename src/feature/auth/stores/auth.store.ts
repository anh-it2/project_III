import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      //default value
      userId: "",
      userName: "",
      isLoggined: false,

      saveLoginnedUser: ({ userName, userId }: { userName: string; userId: string }): void => {
        set({
          userId: `${userId} - ${crypto.randomUUID().slice(0, 8)}`,
          userName,
          isLoggined: true
        });
      },

      removeLogginedUser: () : void => {
        set({
            userId: "",
            userName: "",
            isLoggined: false
        })
      }
    }),
    {
      name: "auth-state",
    },
  ),
);
