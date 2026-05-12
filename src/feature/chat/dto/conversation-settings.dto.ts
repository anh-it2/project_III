export interface ConversationThemeDTO {
  id: string;
  name: string;
  gradient: [string, string];
  primary: string;
  onPrimary: string;
}

export interface ConversationSettingsDTO {
  conversationId: string;
  themeId?: string;
  emoji?: string;
  nicknames?: Record<string, string>;
  muted?: boolean;
  mutedUntil?: number;
  blocked?: boolean;
  e2ee?: boolean;
  e2eePublicKey?: string;
}

export interface SetThemeDTO {
  conversationId: string;
  themeId: string;
  actorId: string;
  actorName: string;
}

export interface SetEmojiDTO {
  conversationId: string;
  emoji: string;
  actorId: string;
  actorName: string;
}

export interface SetNicknameDTO {
  conversationId: string;
  targetUserId: string;
  nickname: string;
  actorId: string;
  actorName: string;
}

export interface MuteDTO {
  conversationId: string;
  muted: boolean;
  mutedUntil?: number;
}

export interface BlockDTO {
  targetUserId: string;
  blocked: boolean;
}

export interface CreateGroupDTO {
  tempId: string;
  name: string;
  memberIds: string[];
}

export interface CreateGroupAck {
  ok: boolean;
  conversationId?: string;
  error?: string;
}

export interface E2EEInitDTO {
  conversationId: string;
  publicKey: string;
}

export interface E2EEReadyDTO {
  conversationId: string;
  peerPublicKey: string;
}

export interface SettingsAck {
  ok: boolean;
  error?: string;
}

export interface ConversationSettingsClientEvents {
  "settings:get": (
    data: { conversationId: string },
    ack: (s: ConversationSettingsDTO | null) => void,
  ) => void;
  "settings:setTheme": (
    data: SetThemeDTO,
    ack: (res: SettingsAck) => void,
  ) => void;
  "settings:setEmoji": (
    data: SetEmojiDTO,
    ack: (res: SettingsAck) => void,
  ) => void;
  "settings:setNickname": (
    data: SetNicknameDTO,
    ack: (res: SettingsAck) => void,
  ) => void;
  "settings:mute": (
    data: MuteDTO,
    ack: (res: SettingsAck) => void,
  ) => void;
  "settings:block": (
    data: BlockDTO,
    ack: (res: SettingsAck) => void,
  ) => void;
  "group:create": (
    data: CreateGroupDTO,
    ack: (res: CreateGroupAck) => void,
  ) => void;
  "e2ee:init": (
    data: E2EEInitDTO,
    ack: (res: SettingsAck) => void,
  ) => void;
}

export interface ConversationSettingsServerEvents {
  "settings:updated": (data: ConversationSettingsDTO) => void;
  "settings:themeChanged": (data: SetThemeDTO) => void;
  "settings:emojiChanged": (data: SetEmojiDTO) => void;
  "settings:nicknameChanged": (data: SetNicknameDTO) => void;
  "group:created": (data: {
    conversationId: string;
    name: string;
    memberIds: string[];
  }) => void;
  "e2ee:ready": (data: E2EEReadyDTO) => void;
}
