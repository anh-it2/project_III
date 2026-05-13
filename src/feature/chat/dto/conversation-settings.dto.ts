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
  "group:leave": (
    data: GroupLeaveDTO,
    ack: (res: GroupActionAck) => void,
  ) => void;
  "group:kick": (
    data: GroupKickDTO,
    ack: (res: GroupActionAck) => void,
  ) => void;
  "group:promote": (
    data: GroupPromoteDTO,
    ack: (res: GroupActionAck) => void,
  ) => void;
  "group:mute-member": (
    data: GroupToggleMemberDTO,
    ack: (res: GroupActionAck) => void,
  ) => void;
  "group:block-member": (
    data: GroupToggleMemberDTO,
    ack: (res: GroupActionAck) => void,
  ) => void;
  "group:delete": (
    data: GroupDeleteDTO,
    ack: (res: GroupActionAck) => void,
  ) => void;
}

export interface GroupCreatedDTO {
  conversationId: string;
  name: string;
  memberIds: string[];
  adminIds: string[];
  mutedMembers: string[];
  blockedMembers: string[];
  createdAt: number;
  createdBy: string;
}

export interface GroupUpdatedDTO extends GroupCreatedDTO {}

export interface GroupDeletedDTO {
  conversationId: string;
}

export interface GroupActionAck {
  ok: boolean;
  error?: string;
}

export interface GroupLeaveDTO {
  conversationId: string;
}

export interface GroupKickDTO {
  conversationId: string;
  targetUserId: string;
}

export interface GroupPromoteDTO {
  conversationId: string;
  targetUserId: string;
}

export interface GroupToggleMemberDTO {
  conversationId: string;
  targetUserId: string;
  on: boolean;
}

export interface GroupDeleteDTO {
  conversationId: string;
}

export interface ConversationSettingsServerEvents {
  "settings:updated": (data: ConversationSettingsDTO) => void;
  "settings:themeChanged": (data: SetThemeDTO) => void;
  "settings:emojiChanged": (data: SetEmojiDTO) => void;
  "settings:nicknameChanged": (data: SetNicknameDTO) => void;
  "group:created": (data: GroupCreatedDTO) => void;
  "group:updated": (data: GroupUpdatedDTO) => void;
  "group:deleted": (data: GroupDeletedDTO) => void;
  "e2ee:ready": (data: E2EEReadyDTO) => void;
}
