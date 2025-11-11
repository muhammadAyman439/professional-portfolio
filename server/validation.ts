import { z } from "zod";

export const statsSchema = z.object({
  yearsOfExperience: z.string(),
  totalFundingSecured: z.string(),
  countries: z.string(),
  winningRate: z.string(),
});

export const bioSchema = z.object({
  short: z.string(),
  full: z.string(),
});

export const profileSchema = z
  .object({
    name: z.string(),
    title: z.string(),
    tagline: z.string(),
    email: z.string().email(),
    phone: z.string(),
    location: z.string(),
    profileImage: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    stats: statsSchema,
    bio: bioSchema,
    mission: z.string(),
    philosophy: z.array(z.string()),
    sectors: z.array(z.string()),
    regions: z.array(z.string()),
  })
  .strict();

export const caseStudySchema = z
  .object({
    id: z.string().min(1).optional(),
    title: z.string(),
    client: z.string(),
    sector: z.string(),
    contractValue: z.string(),
    country: z.string(),
    description: z.string(),
    keyAchievements: z.array(z.string()),
    image: z.string().url(),
    featured: z.boolean(),
  })
  .strict();

export const insightSchema = z
  .object({
    id: z.string().min(1).optional(),
    title: z.string(),
    excerpt: z.string(),
    content: z.string(),
    category: z.string(),
    date: z.string(),
    readTime: z.string(),
    featured: z.boolean(),
  })
  .strict();

export type ProfilePayload = z.infer<typeof profileSchema>;
export type CaseStudyPayload = z.infer<typeof caseStudySchema>;
export type InsightPayload = z.infer<typeof insightSchema>;

