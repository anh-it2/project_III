"use client";

import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { useChat } from "../../hooks/useChat";
import { useMessages } from "../../hooks/useMessage";
import { ChatHeader } from "./ChatHeader";
import { EmptyChat } from "./EmptyChat";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

interface ChatMainProps {
  user: OnlineUserDto | null;
}

export function ChatMain({ user }: ChatMainProps) {
  if (!user) return <EmptyChat />;
  return <ActiveChat user={user} />;
}

function ActiveChat({ user }: { user: OnlineUserDto }) {
  const { sendMessage, isConnected } = useChat(user.id);
  const { messages, isLoading } = useMessages(user.id);

  return (
    <section className="flex h-full flex-1 flex-col">
      <ChatHeader user={user} />
      <MessageList user={user} messages={messages} isLoading={isLoading} />
      <MessageInput
        recipientName={user.name}
        onSend={(text) => sendMessage(text, "text").catch(() => undefined)}
        disabled={!isConnected}
      />
    </section>
  );
}
