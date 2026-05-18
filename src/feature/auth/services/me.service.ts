import { apiClient } from "@/shared/lib/apiClient";
import type { AuthResponseDTO } from "../dto/auth.dto";

/** Resolves the current session from the httpOnly cookie. Rejects on 401. */
export async function meService(): Promise<AuthResponseDTO> {
  const res = await apiClient.get<AuthResponseDTO>("/api/auth/me");
  return res.data;
}
