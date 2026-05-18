// Wire shape between the browser and the Next route handler
// (/api/profile), which proxies social-platform-be GET/PATCH
// /users/me/profile. Field-identical to EditProfileValues so the
// edit-profile form maps 1:1 with no translation.

export interface ProfileDTO {
  name: string;
  bio: string;
  location: string;
  work: string;
  education: string;
  relationship: string;
  avatarUrl: string;
  coverUrl: string;
}

export interface ProfileResponseDTO {
  profile: ProfileDTO;
}

/** Non-2xx body returned by the route handler. */
export interface ProfileErrorDTO {
  message: string;
}
