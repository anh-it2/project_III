import { ChatMessage, ReadReceipt, TypingEvent } from "../types";
import { ChatMessageDTO, ReadReceiptDto, SendMessageDTO, TypingEventDTO } from "./chat.dto";

export function toMessage(dto: ChatMessageDTO): ChatMessage {
  return {
    id: dto.id,
    conversationId: dto.conversationId,
    senderId: dto.senderId,
    senderName: dto.senderName,
    content: dto.content,
    timestamp: dto.timestamp,
    type: dto.type,
  };
}

export function toTypingEvent(dto: TypingEventDTO): TypingEvent {
  return {
    conversationId: dto.conversationId,
    userId: dto.userId,
    userName: dto.userName,
    isTyping: dto.isTyping,
  };
}

export function toReadReceipt(dto: ReadReceiptDto): ReadReceipt {
  return {
    conversationId: dto.conversationId,
    userId: dto.userId,
    messageId: dto.messageId,
  };
}

// ─── Client → Server (Model → DTO) ─────────────────────────────────

export function toSendMessageDto(
  conversationId: string,
  content: string,
  type: ChatMessage["type"]
): SendMessageDTO {
  return { conversationId, content, type };
}

export function toMessageDto(model: ChatMessage): ChatMessageDTO {
  return {
    id: model.id,
    conversationId: model.conversationId,
    senderId: model.senderId,
    senderName: model.senderName,
    content: model.content,
    timestamp: model.timestamp,
    type: model.type,
  };
}