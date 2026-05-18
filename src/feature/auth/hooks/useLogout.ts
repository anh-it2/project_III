import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutService } from "../services/logout.service";
import { useAuthStore } from "../stores/auth.store";

/**
 * Logout mutation: clears the httpOnly cookie (server) + local session.
 *
 * Teardown lives in `onSettled` (hook-level, not the `mutate()` callback)
 * so it still runs after the trigger — e.g. a dropdown — unmounts. It also
 * drops the cached `["auth","me"]` so the session bootstrap can't restore
 * the user from a stale success response.
 */
export function useLogout() {
  const removeLogginedUser = useAuthStore((s) => s.removeLogginedUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutService,
    onSettled: () => {
      removeLogginedUser();
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
    },
  });
}
