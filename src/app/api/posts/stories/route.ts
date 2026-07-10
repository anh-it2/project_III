import { NextRequest } from "next/server";
import { createStory, listStories } from "@/feature/feed/server/postProxy";

export async function GET(req: NextRequest) {
  return listStories(req);
}

export async function POST(req: NextRequest) {
  return createStory(req);
}
