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
          userId,
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
