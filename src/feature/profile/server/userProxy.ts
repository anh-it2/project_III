import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/feature/auth/server/authProxy";
import { API_BASE_URL } from "@/shared/lib/apiBaseUrl";
import type { PublicUserDTO } from "../dto/profile.dto";

interface BackendEnvelope {
  success: boolean;
  message?: string;
  data?: PublicUserDTO;
}

interface BackendListEnvelope {
  success: boolean;
  message?: string;
  data?: PublicUserDTO[];
}

/**
 * Proxies social-platform-be `GET /users` (a PUBLIC endpoint — no
 * requireAuth on the BE): the full user roster. Used to seed the chat
 * contacts list so a freshly-registered account sees everyone (offline
 * until presence flips them online), not just whoever is live right now.
 * The JWT cookie is forwarded when present but is not required.
 */
export async function fetchUsersList(req: NextRequest): Promise<NextResponse> {
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  try {
    const beRes = await axios.request<BackendListEnvelope>({
      baseURL: API_BASE_URL,
      url: `/users`,
      method: "get",
      headers: token ? { authorization: `Bearer ${token}` } : undefined,
    });
    const body = beRes.data;
    if (!body?.success || !body.data) {
      return NextResponse.json(
        { message: body?.message || "User list request failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({ users: body.data }, { status: 200 });
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const body = err.response.data as BackendListEnvelope | undefined;
      return NextResponse.json(
        { message: body?.message || "User list request failed" },
        { status: err.response.status },
      );
    }
    return NextResponse.json(
      { message: "Cannot reach user server" },
      { status: 502 },
    );
  }
}

/**
 * Proxies social-platform-be `GET /users/:id` (a PUBLIC endpoint — no
 * requireAuth on the BE), used to resolve another person's display name
 * when viewing their profile. The JWT cookie is forwarded as a Bearer
 * token when present (the BE ignores it here) but is NOT required, so
 * there is no 401 short-circuit like the authenticated proxies.
 */
export async function fetchUserById(
  req: NextRequest,
  id: string,
): Promise<NextResponse> {
  const token = req.cookies.get(AUTH_COOKIE)?.value;

  try {
    const beRes = await axios.request<BackendEnvelope>({
      baseURL: API_BASE_URL,
      url: `/users/${encodeURIComponent(id)}`,
      method: "get",
      headers: token ? { authorization: `Bearer ${token}` } : undefined,
    });
    const body = beRes.data;
    if (!body?.success || !body.data) {
      return NextResponse.json(
        { message: body?.message || "User request failed" },
        { status: 502 },
      );
    }
    return NextResponse.json({ user: body.data }, { status: 200 });
  } catch (err) {
    // Non-2xx from the BE: relay its status + human message.
    if (axios.isAxiosError(err) && err.response) {
      const body = err.response.data as BackendEnvelope | undefined;
      return NextResponse.json(
        { message: body?.message || "User request failed" },
        { status: err.response.status },
      );
    }
    // Network/timeout — BE unreachable.
    return NextResponse.json(
      { message: "Cannot reach user server" },
      { status: 502 },
    );
  }
}
