import { Socket } from "socket.io-client";
import { getNamespaceSocket } from "@/socket/client/manager";
import { useAuthStore } from "../auth/stores/auth.store";
import {
  ReportClientToServerEvents,
  ReportServerToClientEvents,
} from "./dto/report.dto";

export type ReportSocket = Socket<
  ReportServerToClientEvents,
  ReportClientToServerEvents
>;

export function getReportSocket(): ReportSocket {
  const { userId, userName } = useAuthStore.getState();
  return getNamespaceSocket<ReportSocket>("/report", {
    userId,
    userName,
  });
}

let initialized = false;

export function initReport() {
  if (initialized) return;
  initialized = true;
  getReportSocket();
}

export function disposeReport() {
  initialized = false;
}
