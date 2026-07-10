import { apiClient } from "@/shared/lib/apiClient";
import type { PublicUserDTO } from "@/feature/profile/dto/profile.dto";
import type { OnlineUserDto } from "../dto/presence.dto";

interface UsersListResponse {
  users: PublicUserDTO[];
}

/**
 * Fetches the full user roster via the same-origin route handler, which
 * proxies social-platform-be `GET /users`. Mapped to OnlineUserDto so it
 * can seed the presence store's `knownUsers` — the source of the chat
 * contacts list. Presence events then toggle each user's online dot.
 */
export async function listUsersService(): Promise<OnlineUserDto[]> {
  const res = await apiClient.get<UsersListResponse>("/api/users");
  return res.data.users.map((u) => ({ id: u.id, name: u.name }));
}
