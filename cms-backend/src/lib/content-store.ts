import prisma from "./prisma";
import { Prisma } from "@prisma/client";
import type {
  ApproachStep,
  CaseStudy,
  ContentData,
  FAQ,
  Insight,
  Profile,
  ProfileCTA,
} from "@/types/content";
import { ApiError } from "./http";

function isMissingProfileColumnError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021") {
    return true;
  }
  if (error instanceof Error) {
    return error.message.includes("Profile") && error.message.includes("does not exist");
  }
  return false;
}

function normalizeLegacyProfileRow(row: Record<string, unknown>) {
  const statsYearsOfExperience =
    typeof row.statsYearsOfExperience === "string"
      ? row.statsYearsOfExperience
      : typeof row.statsYears === "string"
        ? row.statsYears
        : "";
  const statsTotalFundingSecured =
    typeof row.statsTotalFundingSecured === "string"
      ? row.statsTotalFundingSecured
      : typeof row.statsProposals === "string"
        ? row.statsProposals
        : "";
  const statsCountries =
    typeof row.statsCountries === "string"
      ? row.statsCountries
      : typeof row.statsClients === "string"
        ? row.statsClients
        : "";
  const statsWinningRate =
    typeof row.statsWinningRate === "string"
      ? row.statsWinningRate
      : typeof row.statsSuccessRate === "string"
        ? row.statsSuccessRate
        : "";

  let approach: unknown = row.approach ?? [];
  if (typeof approach === "string") {
    try {
      approach = JSON.parse(approach);
    } catch {
      approach = [];
    }
  }

  return {
    name: String(row.name ?? ""),
    title: String(row.title ?? ""),
    tagline: String(row.tagline ?? ""),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    location: String(row.location ?? ""),
    profileImage: typeof row.profileImage === "string" ? row.profileImage : null,
    linkedin: typeof row.linkedin === "string" ? row.linkedin : null,
    twitter: typeof row.twitter === "string" ? row.twitter : null,
    statsYearsOfExperience,
    statsTotalFundingSecured,
    statsCountries,
    statsWinningRate,
    bioShort: typeof row.bioShort === "string" ? row.bioShort : "",
    bioFull: typeof row.bioFull === "string" ? row.bioFull : "",
    mission: typeof row.mission === "string" ? row.mission : "",
    missionSupporting: typeof row.missionSupporting === "string" ? row.missionSupporting : null,
    philosophy: Array.isArray(row.philosophy) ? (row.philosophy as string[]) : [],
    sectors: Array.isArray(row.sectors) ? (row.sectors as string[]) : [],
    regions: Array.isArray(row.regions) ? (row.regions as string[]) : [],
    approach,
    ctaHeading: typeof row.ctaHeading === "string" ? row.ctaHeading : null,
    ctaBody: typeof row.ctaBody === "string" ? row.ctaBody : null,
    ctaButtonLabel: typeof row.ctaButtonLabel === "string" ? row.ctaButtonLabel : null,
    ctaButtonHref: typeof row.ctaButtonHref === "string" ? row.ctaButtonHref : null,
  };
}

async function fetchLegacyProfile(): Promise<Profile> {
  const rows = await prisma.$queryRaw<Record<string, unknown>[]>(
    Prisma.sql`SELECT * FROM "Profile" WHERE "id" = 'profile' LIMIT 1`,
  );

  if (!rows.length) {
    throw notFound("Profile");
  }

  const normalized = normalizeLegacyProfileRow(rows[0]);
  return transformProfile(normalized);
}

async function updateLegacyProfile(profile: Profile) {
  const columns = await prisma.$queryRaw<Array<{ column_name: string }>>(
    Prisma.sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name = 'Profile'
    `,
  );

  const columnSet = new Set(columns.map((column) => column.column_name));
  const updates: Array<{ column: string; value: unknown }> = [];

  const pushIf = (column: string, value: unknown) => {
    if (columnSet.has(column)) {
      updates.push({ column, value });
    }
  };

  pushIf("name", profile.name);
  pushIf("title", profile.title);
  pushIf("tagline", profile.tagline);
  pushIf("email", profile.email);
  pushIf("phone", profile.phone);
  pushIf("location", profile.location);
  pushIf("profileImage", profile.profileImage ?? null);
  pushIf("linkedin", profile.linkedin ?? null);
  pushIf("twitter", profile.twitter ?? null);

  // Support both legacy and new column names for stats
  pushIf("statsYears", profile.stats.yearsOfExperience);
  pushIf("statsYearsOfExperience", profile.stats.yearsOfExperience);
  pushIf("statsProposals", profile.stats.totalFundingSecured);
  pushIf("statsTotalFundingSecured", profile.stats.totalFundingSecured);
  pushIf("statsClients", profile.stats.countries);
  pushIf("statsCountries", profile.stats.countries);
  pushIf("statsSuccessRate", profile.stats.winningRate);
  pushIf("statsWinningRate", profile.stats.winningRate);

  pushIf("bioShort", profile.bio.short);
  pushIf("bioFull", profile.bio.full);
  pushIf("mission", profile.mission);

  if (columnSet.has("missionSupporting")) {
    pushIf("missionSupporting", profile.missionSupporting ?? null);
  }

  if (columnSet.has("philosophy")) {
    pushIf("philosophy", profile.philosophy);
  }
  if (columnSet.has("sectors")) {
    pushIf("sectors", profile.sectors);
  }
  if (columnSet.has("regions")) {
    pushIf("regions", profile.regions);
  }
  if (columnSet.has("approach")) {
    pushIf("approach", profile.approach as unknown as Prisma.JsonArray);
  }
  if (columnSet.has("ctaHeading")) {
    pushIf("ctaHeading", profile.cta?.heading ?? null);
  }
  if (columnSet.has("ctaBody")) {
    pushIf("ctaBody", profile.cta?.body ?? null);
  }
  if (columnSet.has("ctaButtonLabel")) {
    pushIf("ctaButtonLabel", profile.cta?.buttonLabel ?? null);
  }
  if (columnSet.has("ctaButtonHref")) {
    pushIf("ctaButtonHref", profile.cta?.buttonHref ?? null);
  }

  if (!updates.length) {
    return;
  }

  await prisma.$transaction(
    updates.map(({ column, value }) =>
      prisma.$executeRaw(
        Prisma.sql`
          UPDATE "Profile"
          SET ${Prisma.raw(`"${column}"`)} = ${value},
              "updatedAt" = now()
          WHERE "id" = 'profile'
        `,
      ),
    ),
  );
}

function sanitizeApproach(value: unknown): ApproachStep[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const steps: ApproachStep[] = [];

  for (const entry of value) {
    if (!entry || typeof entry !== "object") {
      continue;
    }
    const { title, description, focus } = entry as Record<string, unknown>;
    if (typeof title !== "string" || typeof description !== "string") {
      continue;
    }
    steps.push({
      title,
      description,
      focus: typeof focus === "string" && focus.trim().length > 0 ? focus : undefined,
    });
  }

  return steps;
}

function buildCTA(profile: any): ProfileCTA | undefined {
  const heading = profile.ctaHeading;
  const body = profile.ctaBody;
  const buttonLabel = profile.ctaButtonLabel;
  const buttonHref = profile.ctaButtonHref;

  if (!heading && !body && !buttonLabel && !buttonHref) {
    return undefined;
  }

  return {
    heading: typeof heading === "string" ? heading : "Let's Work Together",
    body:
      typeof body === "string"
        ? body
        : "Whether you're looking to improve your proposal process or build a winning team, I'm here to help.",
    buttonLabel: typeof buttonLabel === "string" && buttonLabel.trim().length > 0 ? buttonLabel : "Get in Touch",
    buttonHref: typeof buttonHref === "string" && buttonHref.trim().length > 0 ? buttonHref : "/contact",
  } satisfies ProfileCTA;
}

function transformProfile(prismaProfile: any): Profile {
  return {
    name: prismaProfile.name,
    title: prismaProfile.title,
    tagline: prismaProfile.tagline,
    email: prismaProfile.email,
    phone: prismaProfile.phone,
    location: prismaProfile.location,
    profileImage: prismaProfile.profileImage ?? undefined,
    linkedin: prismaProfile.linkedin ?? undefined,
    twitter: prismaProfile.twitter ?? undefined,
    stats: {
      yearsOfExperience: prismaProfile.statsYearsOfExperience,
      totalFundingSecured: prismaProfile.statsTotalFundingSecured,
      countries: prismaProfile.statsCountries,
      winningRate: prismaProfile.statsWinningRate,
    },
    bio: {
      short: prismaProfile.bioShort,
      full: prismaProfile.bioFull,
    },
    mission: prismaProfile.mission,
    missionSupporting: prismaProfile.missionSupporting ?? undefined,
    philosophy: prismaProfile.philosophy,
    sectors: prismaProfile.sectors,
    regions: prismaProfile.regions,
    approach: sanitizeApproach(prismaProfile.approach),
    cta: buildCTA(prismaProfile),
  };
}

function transformProfileToPrisma(profile: Profile) {
  return {
    name: profile.name,
    title: profile.title,
    tagline: profile.tagline,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    profileImage: profile.profileImage,
    linkedin: profile.linkedin,
    twitter: profile.twitter,
    statsYearsOfExperience: profile.stats.yearsOfExperience,
    statsTotalFundingSecured: profile.stats.totalFundingSecured,
    statsCountries: profile.stats.countries,
    statsWinningRate: profile.stats.winningRate,
    bioShort: profile.bio.short,
    bioFull: profile.bio.full,
    mission: profile.mission,
    missionSupporting: profile.missionSupporting ?? null,
    philosophy: profile.philosophy,
    sectors: profile.sectors,
    regions: profile.regions,
    approach: profile.approach as unknown as Prisma.JsonArray,
    ctaHeading: profile.cta?.heading ?? null,
    ctaBody: profile.cta?.body ?? null,
    ctaButtonLabel: profile.cta?.buttonLabel ?? null,
    ctaButtonHref: profile.cta?.buttonHref ?? null,
  };
}

function notFound(resource: string) {
  return new ApiError(404, `${resource} not found`);
}

export async function getAllContent(): Promise<ContentData> {
  const [profile, caseStudies, insights, faqs] = await Promise.all([
    getProfile(),
    getCaseStudies(),
    getInsights(),
    getFAQs(),
  ]);

  return {
    profile,
    caseStudies,
    insights,
    faqs,
  };
}

export async function getProfile(): Promise<Profile> {
  try {
    const profileData = await prisma.profile.findUnique({
      where: { id: "profile" },
    });

    if (!profileData) {
      throw notFound("Profile");
    }

    return transformProfile(profileData);
  } catch (error) {
    if (isMissingProfileColumnError(error)) {
      return fetchLegacyProfile();
    }
    throw error;
  }
}

export async function updateProfile(profile: Profile): Promise<Profile> {
  const prismaProfile = transformProfileToPrisma(profile);

  try {
    const updated = await prisma.profile.upsert({
      where: { id: "profile" },
      update: prismaProfile,
      create: {
        id: "profile",
        ...prismaProfile,
      },
    });

    return transformProfile(updated);
  } catch (error) {
    if (isMissingProfileColumnError(error)) {
      await updateLegacyProfile(profile);
      return fetchLegacyProfile();
    }
    throw error;
  }
}

export async function updateAdminToken(token: string): Promise<void> {
  await prisma.profile.upsert({
    where: { id: "profile" },
    update: { adminToken: token },
    create: {
      id: "profile",
      adminToken: token,
      name: "Admin",
      title: "Admin",
      tagline: "Admin",
      email: "admin@example.com",
      phone: "",
      location: "",
      statsYearsOfExperience: "0",
      statsTotalFundingSecured: "0",
      statsCountries: "0",
      statsWinningRate: "0",
      bioShort: "",
      bioFull: "",
      mission: "",
      philosophy: [],
      sectors: [],
      regions: [],
    },
  });
}

export async function getAdminToken(): Promise<string | null> {
  const profile = await prisma.profile.findUnique({
    where: { id: "profile" },
    select: { adminToken: true },
  });
  return profile?.adminToken ?? null;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return prisma.caseStudy.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export async function createCaseStudy(
  payload: Omit<CaseStudy, "id"> & Partial<Pick<CaseStudy, "id">>
): Promise<CaseStudy> {
  const data: any = {
    title: payload.title,
    client: payload.client,
    sector: payload.sector,
    contractValue: payload.contractValue,
    country: payload.country,
    description: payload.description,
    keyAchievements: payload.keyAchievements,
    image: payload.image,
    featured: payload.featured,
    order: payload.order,
  };

  if (payload.id) {
    data.id = payload.id;
  }

  return prisma.caseStudy.create({ data });
}

export async function updateCaseStudy(
  id: string,
  payload: Partial<CaseStudy>
): Promise<CaseStudy> {
  try {
    return await prisma.caseStudy.update({
      where: { id },
      data: payload,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw notFound("Case study");
    }
    throw error;
  }
}

export async function deleteCaseStudy(id: string): Promise<void> {
  try {
    await prisma.caseStudy.delete({
      where: { id },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw notFound("Case study");
    }
    throw error;
  }
}

export async function getInsights(): Promise<Insight[]> {
  return prisma.insight.findMany({
    orderBy: [{ featured: "desc" }, { date: "desc" }],
  });
}

export async function addNewsletterSubscriber(
  email: string
): Promise<{ created: boolean }> {
  try {
    await prisma.newsletterSubscriber.create({
      data: { email },
    });
    return { created: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { created: false };
    }
    throw error;
  }
}

export async function getNewsletterSubscribers(): Promise<
  Array<{ email: string }>
> {
  return prisma.newsletterSubscriber.findMany({
    select: { email: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function createInsight(
  payload: Omit<Insight, "id"> & Partial<Pick<Insight, "id">>
): Promise<Insight> {
  const data: any = {
    title: payload.title,
    excerpt: payload.excerpt,
    content: payload.content,
    category: payload.category,
    date: payload.date,
    readTime: payload.readTime,
    featured: payload.featured,
  };

  if (payload.id) {
    data.id = payload.id;
  }

  return prisma.insight.create({ data });
}

export async function updateInsight(
  id: string,
  payload: Partial<Insight>
): Promise<Insight> {
  try {
    return await prisma.insight.update({
      where: { id },
      data: payload,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw notFound("Insight");
    }
    throw error;
  }
}

export async function deleteInsight(id: string): Promise<void> {
  try {
    await prisma.insight.delete({
      where: { id },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw notFound("Insight");
    }
    throw error;
  }
}

export async function getFAQs(): Promise<FAQ[]> {
  return prisma.fAQ.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function createFAQ(
  payload: Omit<FAQ, "id"> & Partial<Pick<FAQ, "id">>
): Promise<FAQ> {
  const data: any = {
    question: payload.question,
    answer: payload.answer,
    order: payload.order,
  };

  if (payload.id) {
    data.id = payload.id;
  }

  return prisma.fAQ.create({ data });
}

export async function updateFAQ(
  id: string,
  payload: Partial<FAQ>
): Promise<FAQ> {
  try {
    return await prisma.fAQ.update({
      where: { id },
      data: payload,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw notFound("FAQ");
    }
    throw error;
  }
}

export async function deleteFAQ(id: string): Promise<void> {
  try {
    await prisma.fAQ.delete({
      where: { id },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      throw notFound("FAQ");
    }
    throw error;
  }
}
