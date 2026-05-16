import type { FriendStatus } from "../dto/friends.dto";

/**
 * The single seam between UI and backend.
 *
 * UI/hooks depend ONLY on this interface. The mock adapter implements it
 * against the local store today; a real `friends.api.ts` (REST or socket)
 * implements the same interface later. Swapping backends = changing one
 * line in service/index.ts.
 */
export interface FriendsService {
  /** Hydrate initial relationships (idempotent). */
  init(): void;
  /** Current relationship to a user. */
  getStatus(userId: string): FriendStatus;
  /** Send a friend request -> status becomes "requested". */
  sendRequest(userId: string): Promise<void>;
  /** Cancel a request I sent -> status becomes "none". */
  cancelRequest(userId: string): Promise<void>;
  /** Accept an incoming request -> status becomes "friends". */
  acceptRequest(userId: string): Promise<void>;
  /** Reject an incoming request -> status becomes "none". */
  rejectRequest(userId: string): Promise<void>;
  /** Remove an existing friend -> status becomes "none". */
  unfriend(userId: string): Promise<void>;
}
