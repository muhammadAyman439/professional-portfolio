import { PrismaClient } from "@prisma/client";
import { CaseStudy, ContentData, Insight, Profile } from "../shared/content";

const prisma = new PrismaClient();

function createNotFoundError(resource: string) {
  const error = new Error(`${resource} not found`);
  (error as Error & { status?: number }).status = 404;
  return error;
}

// Transform Prisma Profile to app Profile format
function transformProfile(prismaProfile: any): Profile {
  return {
    name: prismaProfile.name,
    title: prismaProfile.title,
    tagline: prismaProfile.tagline,
    email: prismaProfile.email,
    phone: prismaProfile.phone,
    location: prismaProfile.location,
    profileImage: prismaProfile.profileImage,
    linkedin: prismaProfile.linkedin,
    twitter: prismaProfile.twitter,
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
    philosophy: prismaProfile.philosophy,
    sectors: prismaProfile.sectors,
    regions: prismaProfile.regions,
  };
}

// Transform app Profile to Prisma format
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
    philosophy: profile.philosophy,
    sectors: profile.sectors,
    regions: profile.regions,
  };
}

export async function getAllContent(): Promise<ContentData> {
  const [profileData, caseStudies, insights] = await Promise.all([
    prisma.profile.findUnique({ where: { id: "profile" } }),
    prisma.caseStudy.findMany(),
    prisma.insight.findMany(),
  ]);

  if (!profileData) {
    throw createNotFoundError("Profile");
  }

  const profile = transformProfile(profileData);

  return {
    profile,
    caseStudies,
    insights,
  };
}

export async function getProfile(): Promise<Profile> {
  const profileData = await prisma.profile.findUnique({ 
    where: { id: "profile" } 
  });

  if (!profileData) {
    throw createNotFoundError("Profile");
  }

  return transformProfile(profileData);
}

export async function updateProfile(profile: Profile): Promise<Profile> {
  const prismaProfile = transformProfileToPrisma(profile);
  
  const updated = await prisma.profile.upsert({
    where: { id: "profile" },
    update: prismaProfile,
    create: {
      id: "profile",
      ...prismaProfile,
    },
  });

  return transformProfile(updated);
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return prisma.caseStudy.findMany({
    orderBy: [
      { featured: "desc" },
      { createdAt: "desc" },
    ],
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
      throw createNotFoundError("Case study");
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
      throw createNotFoundError("Case study");
    }
    throw error;
  }
}

export async function getInsights(): Promise<Insight[]> {
  return prisma.insight.findMany({
    orderBy: [
      { featured: "desc" },
      { date: "desc" },
    ],
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
      throw createNotFoundError("Insight");
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
      throw createNotFoundError("Insight");
    }
    throw error;
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
