"use client";

import { Layout } from "antd";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import type { OnlineUserDto } from "@/feature/presence/dto/presence.dto";
import { getPresenceSocket } from "@/feature/presence/socket";
import { useRouter } from "@/i18n/navigation";
import { ChatMain } from "./main/ChatMain";
import { ChatRightPanel } from "./right/ChatRightPanel";
import { ChatSidebar } from "./sidebar/ChatSidebar";

export function ChatRoom() {
  const router = useRouter();
  const { isLoggined, userName, removeLogginedUser } = useAuthStore();

  const [users, setUsers] = useState<OnlineUserDto[]>([]);
  const [selected, setSelected] = useState<OnlineUserDto | null>(null);

  useEffect(() => {
    if (!isLoggined) return;
    const socket = getPresenceSocket();

    const onJoined = (u: OnlineUserDto) =>
      setUsers((prev) =>
        prev.some((x) => x.id === u.id) ? prev : [...prev, u],
      );

    const onLeft = (id: string) =>
      setUsers((prev) => prev.filter((x) => x.id !== id));

    socket.on("presence:user-joined", onJoined);
    socket.on("presence:user-left", onLeft);

    socket.emit("presence:get-online-users", (list) => setUsers(list));

    return () => {
      socket.off("presence:user-joined", onJoined);
      socket.off("presence:user-left", onLeft);
    };
  }, [isLoggined]);

  function handleLogout() {
    removeLogginedUser();
    router.push("/login");
  }

  return (
    <Layout className="!h-screen !min-h-screen !bg-[#fafbfc] dark:!bg-[#0a0a0a]">
      <ChatSidebar
        users={users}
        selectedUserId={selected?.id ?? null}
        currentUserName={userName}
        onSelect={setSelected}
        onLogout={handleLogout}
      />
      <Layout className="!bg-transparent">
        <ChatMain user={selected} />
      </Layout>
      <ChatRightPanel user={selected} />
    </Layout>
  );
}
