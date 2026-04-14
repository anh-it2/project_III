import { AuthSession, LoginCredentials } from "../types";
import { LoginRequestDTO, LoginResponseDTO } from "./auth.dto";

// ─── Client → Server (Model → DTO) ─────────────────────────────────

export function toLoginRequestDto(
  credentials: LoginCredentials,
): LoginRequestDTO {
  return {
    username: credentials.username,
    password: credentials.password,
  };
}

// ─── Server → Client (DTO → Model) ─────────────────────────────────

export function toAuthSession(dto: LoginResponseDTO): AuthSession | null {
  if (!dto.data) return null;
  return {
    userId: dto.data.userId,
    username: dto.data.username,
    token: dto.data.token,
  };
}
