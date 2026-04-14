import { Socket } from "socket.io-client";
import {
  PresenceClientToServerEvents,
  PresenceServerToClientEvents,
} from "./dto/presence.dto";
import { getNamespaceSocket } from "@/socket/client/manager";
import { useAuthStore } from "../auth/stores/auth.store";

export type PresenceSocket = Socket<
  PresenceServerToClientEvents,
  PresenceClientToServerEvents
>;

export function getPresenceSocket(): PresenceSocket {
  const { userId, userName } = useAuthStore.getState();
  return getNamespaceSocket<PresenceSocket>("/presence", { userId, userName });
}
