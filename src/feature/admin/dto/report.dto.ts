import type { FeedPostData } from "@/feature/feed/data/types";

//server send to client

export type ReportStatus = "pending" | "approved" | "rejected";

export interface ReportDTO {
  id: string;
  reporterId: string;
  reporterName: string;
  postId: string;
  postOwnerId?: string;
  postSnapshot: FeedPostData;
  reason: string;
  status: ReportStatus;
  createdAt: number;
}

export interface ReportListResponseDTO {
  reports: ReportDTO[];
}

export interface ReportActionAck {
  ok: boolean;
  error?: string;
}

//client send to server

export interface EmitReportDTO {
  postId: string;
  postOwnerId?: string;
  postSnapshot: FeedPostData;
  reason: string;
}

export interface ReportDecisionDTO {
  reportId: string;
}

//socket events

export interface ReportClientToServerEvents {
  "report:list": (
    ack: (res: ReportListResponseDTO) => void,
  ) => void;
  "report:emit": (
    data: EmitReportDTO,
    ack: (res: ReportActionAck) => void,
  ) => void;
  "report:approve": (
    data: ReportDecisionDTO,
    ack: (res: ReportActionAck) => void,
  ) => void;
  "report:reject": (
    data: ReportDecisionDTO,
    ack: (res: ReportActionAck) => void,
  ) => void;
}

export interface ReportPostRemovedDTO {
  postId: string;
  postOwnerId?: string;
}

export interface ReportServerToClientEvents {
  "report:new": (report: ReportDTO) => void;
  "report:status-update": (data: {
    reportId: string;
    status: ReportStatus;
    postId: string;
  }) => void;
  "report:post-removed": (data: ReportPostRemovedDTO) => void;
}
