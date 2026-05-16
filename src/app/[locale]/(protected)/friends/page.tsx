import { Suspense } from "react";
import { FriendsPage } from "@/feature/friends/components/FriendsPage";

export default function Page() {
  // FriendsPage reads `?view=` via useSearchParams (deep-linked from a
  // friend-request notification) — needs a Suspense boundary for build.
  return (
    <Suspense fallback={null}>
      <FriendsPage />
    </Suspense>
  );
}
