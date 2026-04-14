export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  type: "text" | "image" | "file" | "video";
}

export interface TypingEvent {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface ReadReceipt {
  conversationId: string;
  userId: string;
  messageId: string;
}

// Re-export event maps from DTO (socket modules need these)
export type {
  ChatClientToServerEvents,
  ChatServerToClientEvents,
} from "./dto/chat.dto";