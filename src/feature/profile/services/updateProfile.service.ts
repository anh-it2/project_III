import { apiClient } from "@/shared/lib/apiClient";
import type { ProfileDTO, ProfileResponseDTO } from "../dto/profile.dto";

/** Full-replace save. Resolves with the persisted profile echoed by the BE. */
export async function updateProfileService(
  values: ProfileDTO,
): Promise<ProfileDTO> {
  const res = await apiClient.patch<ProfileResponseDTO>("/api/profile", values);
  return res.data.profile;
}
