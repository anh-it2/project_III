import { splitMessageSegments } from "../../../lib/messageLinks";
import type { ChatMessage } from "../../../types";

export interface ExtractedLink {
  url: string;
  messageId: string;
  timestamp?: number;
}

export function extractLinks(messages: ChatMessage[]): ExtractedLink[] {
  const out: ExtractedLink[] = [];
  for (const m of messages) {
    if (m.deleted || m.type !== "text") continue;
    for (const seg of splitMessageSegments(m.content)) {
      if (seg.kind === "url") {
        out.push({
          url: seg.value,
          messageId: m.id ?? m.tempId,
          timestamp: m.timestamp,
        });
      }
    }
  }
  return out.reverse();
}
