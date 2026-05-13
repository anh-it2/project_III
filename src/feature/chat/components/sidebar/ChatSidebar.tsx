"use client";

import { useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { CreateGroupModal } from "../menu/CreateGroupModal";
import type { GroupInfo } from "../../stores/chat.store.type";
import type { SelectedConversation } from "../../types/conversation";
import { ConversationList, type ConversationEntry } from "./list/ConversationList";
import { SidebarFilters } from "./header/SidebarFilters";
import { SidebarHeader } from "./header/SidebarHeader";
import { SidebarSearch } from "./header/SidebarSearch";

interface ChatSidebarProps {
  contacts: ConversationEntry[];
  groups: GroupInfo[];
  selectedId: string | null;
  currentUserName: string;
  onSelect: (selection: SelectedConversation) => void;
  onLogout: () => void;
  unreadMap?: Record<string, boolean>;
}

export function ChatSidebar({
  contacts,
  groups,
  selectedId,
  currentUserName,
  onSelect,
  onLogout,
  unreadMap,
}: ChatSidebarProps) {
  const myId = useAuthStore((s) => s.userId);
  const myName = useAuthStore((s) => s.userName);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  return (
    <aside className="flex h-full w-full flex-col border-r border-[var(--color-border)] bg-white dark:bg-[#141414] md:w-[340px] md:shrink-0">
      <SidebarHeader
        onLogout={onLogout}
        onCreateGroup={() => setShowCreateGroup(true)}
      />
      <SidebarSearch />
      <SidebarFilters />
      <ConversationList
        contacts={contacts}
        groups={groups}
        selectedId={selectedId}
        currentUserName={currentUserName}
        myId={myId}
        myName={myName}
        onSelect={onSelect}
        unreadMap={unreadMap}
      />
      <CreateGroupModal
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
      />
    </aside>
  );
}
