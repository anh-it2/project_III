import { NextRequest } from "next/server";
import { fetchUsersList } from "@/feature/profile/server/userProxy";

// Full public user roster — proxies social-platform-be `GET /users`. Seeds
// the chat contacts / suggestions roster so new accounts see everyone
// (offline until presence marks them online), not just live peers.
export async function GET(req: NextRequest) {
  return fetchUsersList(req);
}
