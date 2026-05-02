import { getNamespaceSocket } from "@/socket/client/manager";
import { useAuthStore } from "../auth/stores/auth.store";
import { Socket } from "socket.io-client";
import {
  ChatClientToServerEvents,
  ChatServerToClientEvents,
} from "./dto/chat.dto";

export type ChatSocket = Socket<
  ChatServerToClientEvents,
  ChatClientToServerEvents
>;

export function getChatSocket(): ChatSocket {
  const { userId, userName } = useAuthStore.getState();
  return getNamespaceSocket<ChatSocket>("/chat", { userId, userName });
}
