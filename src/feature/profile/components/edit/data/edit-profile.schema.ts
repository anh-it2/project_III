import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(60, "Max 60 chars"),
  bio: z.string().max(160, "Max 160 chars"),
  location: z.string().min(1, "Location is required"),
  work: z.string(),
  education: z.string(),
  relationship: z.string(),
  avatarUrl: z.string().optional(),
  coverUrl: z.string().optional(),
});

export type EditProfileValues = z.infer<typeof editProfileSchema>;
