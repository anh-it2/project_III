"use client";

import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { ConversationList, type ConversationEntry } from "./list/ConversationList";
import { SidebarFilters } from "./header/SidebarFilters";
import { SidebarHeader } from "./header/SidebarHeader";
import { SidebarSearch } from "./header/SidebarSearch";

interface ChatSidebarProps {
  contacts: ConversationEntry[];
  selectedUserId: string | null;
  currentUserName: string;
  onSelect: (user: OnlineUserDto) => void;
  onLogout: () => void;
  unreadMap?: Record<string, boolean>;
}

export function ChatSidebar({
  contacts,
  selectedUserId,
  currentUserName,
  onSelect,
  onLogout,
  unreadMap,
}: ChatSidebarProps) {
  const myId = useAuthStore((s) => s.userId);
  const myName = useAuthStore((s) => s.userName);
  return (
    <aside className="flex h-full w-full flex-col border-r border-[var(--color-border)] bg-white dark:bg-[#141414] md:w-[340px] md:shrink-0">
      <SidebarHeader onLogout={onLogout} />
      <SidebarSearch />
      <SidebarFilters />
      <ConversationList
        contacts={contacts}
        selectedUserId={selectedUserId}
        currentUserName={currentUserName}
        myId={myId}
        myName={myName}
        onSelect={onSelect}
        unreadMap={unreadMap}
      />
    </aside>
  );
}
