import { apiClient } from "@/shared/lib/apiClient";
import type { ProfileDTO, ProfileResponseDTO } from "../dto/profile.dto";

/** Loads the current user's profile (server-backed, from the auth cookie). */
export async function getProfileService(): Promise<ProfileDTO> {
  const res = await apiClient.get<ProfileResponseDTO>("/api/profile");
  return res.data.profile;
}
