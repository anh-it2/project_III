import type { FeedPostData } from "@/feature/feed/data/types";
import type { ReportStatus } from "./dto/report.dto";

export type { ReportStatus } from "./dto/report.dto";

export interface Report {
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

export type {
  ReportClientToServerEvents,
  ReportServerToClientEvents,
} from "./dto/report.dto";
