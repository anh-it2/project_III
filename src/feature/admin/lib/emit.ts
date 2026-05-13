import { useAuthStore } from "@/feature/auth/stores/auth.store";
import { getReportSocket } from "../socket";
import type {
  EmitReportDTO,
  ReportActionAck,
} from "../dto/report.dto";

export function emitReport(
  data: EmitReportDTO,
  ack?: (res: ReportActionAck) => void,
): void {
  const { isLoggined } = useAuthStore.getState();
  if (!isLoggined) return;

  const socket = getReportSocket();
  if (!socket || !socket.connected) {
    ack?.({ ok: false, error: "not-connected" });
    return;
  }

  socket.emit("report:emit", data, (res: ReportActionAck) => {
    ack?.(res);
  });
}
