export interface OnlineUserDto {
  id: string;
  name: string;
  avatar?: string;
}

export interface PresenceServerToClientEvents {
  "presence:online-users": (users: OnlineUserDto[]) => void;
  "presence:user-joined": (user: OnlineUserDto) => void;
  "presence:user-left": (userId: string) => void;
}

export interface PresenceClientToServerEvents {
  "presence:get-online-users": (
    ack: (users: OnlineUserDto[]) => void
  ) => void;
}
