import type { EditProfileValues } from "./edit-profile.schema";

// No mock identity. A fresh account starts empty; the logged-in user's
// name is seeded from the auth store (see useProfileMeta).
export const EDIT_PROFILE_DEFAULTS: EditProfileValues = {
  name: "",
  bio: "",
  location: "",
  work: "",
  education: "",
  relationship: "",
  avatarUrl: "",
  coverUrl: "",
};

export const EDIT_PAGE_MAX_WIDTH = 960;
export const EDIT_PAGE_PADDING = "32px 24px 80px";

export const EDIT_CARD_BG = "var(--color-bg-secondary)";
export const EDIT_CARD_BORDER = "1px solid var(--color-border)";
export const EDIT_CARD_RADIUS = 20;
export const EDIT_CARD_PADDING = 24;
export const EDIT_CARD_SHADOW = "var(--shadow-md)";

export const EDIT_COVER_HEIGHT = 240;
export const EDIT_COVER_GRADIENT =
  "linear-gradient(160deg, #0d0d2b 0%, #1a1045 25%, #1e3a6e 55%, #0f4a8a 80%, #1a6fd1 100%)";

export const EDIT_AVATAR_SIZE = 120;
export const EDIT_AVATAR_GRADIENT: [string, string] = ["#4096ff", "#a855f7"];

export const EDIT_PRIMARY_GRADIENT: [string, string] = ["#4096ff", "#a855f7"];
