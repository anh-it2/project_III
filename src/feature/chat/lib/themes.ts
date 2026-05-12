import type { ConversationThemeDTO } from "../dto/conversation-settings.dto";

export const CHAT_THEMES: ConversationThemeDTO[] = [
  {
    id: "default",
    name: "Default",
    gradient: ["var(--color-primary-dark)", "var(--color-primary)"],
    primary: "var(--color-primary)",
    onPrimary: "var(--color-on-primary)",
  },
  {
    id: "ocean",
    name: "Ocean",
    gradient: ["#0ea5e9", "#22d3ee"],
    primary: "#0284c7",
    onPrimary: "#ffffff",
  },
  {
    id: "sunset",
    name: "Sunset",
    gradient: ["#f97316", "#ec4899"],
    primary: "#ea580c",
    onPrimary: "#ffffff",
  },
  {
    id: "forest",
    name: "Forest",
    gradient: ["#16a34a", "#65a30d"],
    primary: "#15803d",
    onPrimary: "#ffffff",
  },
  {
    id: "lavender",
    name: "Lavender",
    gradient: ["#8b5cf6", "#a855f7"],
    primary: "#7c3aed",
    onPrimary: "#ffffff",
  },
  {
    id: "midnight",
    name: "Midnight",
    gradient: ["#1e293b", "#334155"],
    primary: "#1e293b",
    onPrimary: "#ffffff",
  },
  {
    id: "rose",
    name: "Rose",
    gradient: ["#f43f5e", "#fb7185"],
    primary: "#e11d48",
    onPrimary: "#ffffff",
  },
  {
    id: "amber",
    name: "Amber",
    gradient: ["#f59e0b", "#fbbf24"],
    primary: "#d97706",
    onPrimary: "#111827",
  },
];

export const DEFAULT_THEME_ID = "default";
export const DEFAULT_EMOJI = "👍";

export function getTheme(themeId: string | undefined): ConversationThemeDTO {
  return (
    CHAT_THEMES.find((t) => t.id === themeId) ?? CHAT_THEMES[0]
  );
}
