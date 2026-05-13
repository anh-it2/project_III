import type { Report } from "../types";
import type { ReportDTO } from "./report.dto";

export function toReport(dto: ReportDTO): Report {
  return {
    id: dto.id,
    reporterId: dto.reporterId,
    reporterName: dto.reporterName,
    postId: dto.postId,
    postOwnerId: dto.postOwnerId,
    postSnapshot: dto.postSnapshot,
    reason: dto.reason,
    status: dto.status,
    createdAt: dto.createdAt,
  };
}

export function toReports(dtos: ReportDTO[]): Report[] {
  return dtos.map(toReport);
}
