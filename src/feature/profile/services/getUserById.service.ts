import { apiClient } from "@/shared/lib/apiClient";
import type { PublicUserResponseDTO, PublicUserDTO } from "../dto/profile.dto";

/**
 * Fetches a public user by id (display name etc) via the same-origin route
 * handler, which proxies social-platform-be `GET /users/:id`.
 */
export async function getUserByIdService(
  id: string,
): Promise<PublicUserDTO> {
  const res = await apiClient.get<PublicUserResponseDTO>(
    `/api/users/${encodeURIComponent(id)}`,
  );
  return res.data.user;
}
