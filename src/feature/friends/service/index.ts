import type { FriendsService } from "./friends.port";
import { friendsMock } from "./friends.mock";

/**
 * SINGLE BACKEND SWAP POINT.
 *
 * When the real backend is ready, create ./friends.api.ts implementing
 * FriendsService and change the line below to:
 *
 *   import { friendsApi } from "./friends.api";
 *   export const friendsService: FriendsService = friendsApi;
 *
 * No UI/hook/store changes required.
 */
export const friendsService: FriendsService = friendsMock;

export type { FriendsService } from "./friends.port";
