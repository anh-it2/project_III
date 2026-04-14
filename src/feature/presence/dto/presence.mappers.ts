import { OnlineUser } from "../types";
import type { OnlineUserDto } from "./presence.dto";

export function toOnlineUser(dto: OnlineUserDto): OnlineUser {
  return {
    id: dto.id,
    name: dto.name,
    avatar: dto.avatar,
  };
}

export function toOnlineUserDto(model: OnlineUser): OnlineUserDto {
  return {
    id: model.id,
    name: model.name,
    avatar: model.avatar,
  };
}
