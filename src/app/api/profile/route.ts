import { NextRequest } from "next/server";
import { fetchProfile, saveProfile } from "@/feature/profile/server/profileProxy";

export async function GET(req: NextRequest) {
  return fetchProfile(req);
}

export async function PATCH(req: NextRequest) {
  return saveProfile(req);
}
