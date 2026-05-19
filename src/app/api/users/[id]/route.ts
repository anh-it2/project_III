import { NextRequest } from "next/server";
import { fetchUserById } from "@/feature/profile/server/userProxy";

// Public user lookup by id (display name etc) for viewing another person's
// profile. Next 16: dynamic params are async — must be awaited.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return fetchUserById(req, id);
}
