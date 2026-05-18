import { NextRequest } from "next/server";
import { fetchMe } from "@/feature/auth/server/authProxy";

export async function GET(req: NextRequest) {
  return fetchMe(req);
}
