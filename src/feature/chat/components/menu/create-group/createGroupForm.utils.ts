import { z } from "zod";

export function buildGroupSchema(needMembersMessage: string) {
  return z.object({
    name: z.string().max(60),
    memberIds: z.array(z.string()).min(2, needMembersMessage),
  });
}

export type GroupFormValues = z.infer<ReturnType<typeof buildGroupSchema>>;

export function buildGroupDefaults(seedPeerId?: string): GroupFormValues {
  return {
    name: "",
    memberIds: seedPeerId ? [seedPeerId] : [],
  };
}
