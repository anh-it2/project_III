"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { App } from "antd";
import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { getNotificationSocket } from "../socket";
import { useNotificationStore } from "../stores/notification.store";
import { toNotification, toNotifications } from "../dto/notification.mapper";
import {
  EmitNotificationDTO,
  FirstUserResponseDTO,
  NotificationActionAck,
  NotificationDTO,
  NotificationListResponseDTO,
} from "../dto/notification.dto";
import { setFirstUserId, clearFirstUserId } from "@/shared/lib/firstUser";
import { NotificationItemContent } from "@/shared/components/notification/NotificationItemContent";
import { useNotificationNavigate } from "./useNotificationNavigate";
import type { Notification } from "../types";

/**
 * Mount once at top-level (e.g. NotificationNavBtn). Attaches socket listeners,
 * fetches initial list on (re)connect, fires antd notification toast on push,
 * and exposes emit/read actions. Requires antd `App` wrapper in the tree.
 */
export function useNotifications() {
  const isLoggined = useAuthStore((s) => s.isLoggined);
  const socket = getNotificationSocket();
  const [isConnected, setIsConnected] = useState<boolean>(
    socket?.connected ?? false,
  );
  const { setAll, addOne, markRead, markAllRead } =
    useNotificationStore.getState();

  const { notification } = App.useApp();
  const apiRef = useRef(notification);
  apiRef.current = notification;

  // Clicking a toast: mark read (+ multi-tab sync), close it, then route
  // the same way the dropdown row does. Kept in a ref so the push-event
  // effect never re-subscribes when nav identity changes.
  const navigateNotification = useNotificationNavigate();
  const toastClickRef = useRef<(n: Notification) => void>(() => {});
  toastClickRef.current = (n: Notification) => {
    if (socket && isConnected) {
      markRead(n.id);
      socket.emit(
        "notification:read",
        { notificationId: n.id },
        (_ack: NotificationActionAck) => {},
      );
    }
    apiRef.current.destroy(n.id);
    navigateNotification(n);
  };

  // first render hides past notifications. Suppress toast until initial list resolves.
  const initialFetchedRef = useRef(false);

  useEffect(() => {
    if (!isLoggined || !socket) return;

    const onConnected = () => setIsConnected(true);
    const onDisconnected = () => setIsConnected(false);

    socket.on("connect", onConnected);
    socket.on("disconnect", onDisconnected);

    return () => {
      socket.off("connect", onConnected);
      socket.off("disconnect", onDisconnected);
    };
  }, [isLoggined, socket]);

  // fetch list + first-user on connect / reconnect
  useEffect(() => {
    if (!isLoggined || !socket || !isConnected) return;

    socket.emit("notification:list", (res: NotificationListResponseDTO) => {
      setAll(toNotifications(res.notifications));
      initialFetchedRef.current = true;
    });

    socket.emit("notification:first-user", (res: FirstUserResponseDTO) => {
      if (res.userId) setFirstUserId(res.userId);
      else clearFirstUserId();
    });
  }, [isLoggined, socket, isConnected, setAll]);

  // server-pushed events
  useEffect(() => {
    if (!isLoggined || !socket) return;

    const handleNew = (dto: NotificationDTO) => {
      const n = toNotification(dto);
      addOne(n);

      if (!initialFetchedRef.current) return;

      apiRef.current.open({
        key: n.id,
        title: (
          <div
            className="!cursor-pointer"
            onClick={() => toastClickRef.current(n)}
          >
            <NotificationItemContent notification={n} />
          </div>
        ),
      });
    };

    const handleReadUpdate = (notificationId: string) => {
      markRead(notificationId);
    };

    const handleReadAllUpdate = () => {
      markAllRead();
    };

    socket.on("notification:new", handleNew);
    socket.on("notification:read-update", handleReadUpdate);
    socket.on("notification:read-all-update", handleReadAllUpdate);

    return () => {
      socket.off("notification:new", handleNew);
      socket.off("notification:read-update", handleReadUpdate);
      socket.off("notification:read-all-update", handleReadAllUpdate);
    };
  }, [isLoggined, socket, addOne, markRead, markAllRead]);

  const emit = useCallback(
    (data: EmitNotificationDTO) => {
      if (!socket || !isConnected) return;
      socket.emit("notification:emit", data, (_ack: NotificationActionAck) => {});
    },
    [socket, isConnected],
  );

  const readOne = useCallback(
    (notificationId: string) => {
      if (!socket || !isConnected) return;
      markRead(notificationId);
      socket.emit(
        "notification:read",
        { notificationId },
        (_ack: NotificationActionAck) => {},
      );
    },
    [socket, isConnected, markRead],
  );

  const readAll = useCallback(() => {
    if (!socket || !isConnected) return;
    markAllRead();
    socket.emit("notification:read-all", (_ack: NotificationActionAck) => {});
  }, [socket, isConnected, markAllRead]);

  return { isConnected, emit, readOne, readAll };
}
