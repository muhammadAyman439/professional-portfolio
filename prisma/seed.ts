import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Read JSON files
  const profilePath = path.join(__dirname, "..", "server", "data", "profile.json");
  const caseStudiesPath = path.join(__dirname, "..", "server", "data", "caseStudies.json");
  const insightsPath = path.join(__dirname, "..", "server", "data", "insights.json");

  const profileData = JSON.parse(await readFile(profilePath, "utf-8"));
  const caseStudiesData = JSON.parse(await readFile(caseStudiesPath, "utf-8"));
  const insightsData = JSON.parse(await readFile(insightsPath, "utf-8"));

  // Seed Profile
  console.log("📝 Seeding profile...");
  await prisma.profile.upsert({
    where: { id: "profile" },
    update: {
      name: profileData.name,
      title: profileData.title,
      tagline: profileData.tagline,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      profileImage: profileData.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
      linkedin: profileData.linkedin,
      twitter: profileData.twitter,
      statsYearsOfExperience: profileData.stats.yearsOfExperience || profileData.stats.years || "+6",
      statsTotalFundingSecured: profileData.stats.totalFundingSecured || profileData.stats.proposals || "$M12+",
      statsCountries: profileData.stats.countries || profileData.stats.clients || "5+",
      statsWinningRate: profileData.stats.winningRate || profileData.stats.successRate || "75%",
      bioShort: profileData.bio.short,
      bioFull: profileData.bio.full,
      mission: profileData.mission,
      philosophy: profileData.philosophy,
      sectors: profileData.sectors,
      regions: profileData.regions,
    },
    create: {
      id: "profile",
      name: profileData.name,
      title: profileData.title,
      tagline: profileData.tagline,
      email: profileData.email,
      phone: profileData.phone,
      location: profileData.location,
      profileImage: profileData.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
      linkedin: profileData.linkedin,
      twitter: profileData.twitter,
      statsYearsOfExperience: profileData.stats.yearsOfExperience || profileData.stats.years || "+6",
      statsTotalFundingSecured: profileData.stats.totalFundingSecured || profileData.stats.proposals || "$M12+",
      statsCountries: profileData.stats.countries || profileData.stats.clients || "5+",
      statsWinningRate: profileData.stats.winningRate || profileData.stats.successRate || "75%",
      bioShort: profileData.bio.short,
      bioFull: profileData.bio.full,
      mission: profileData.mission,
      philosophy: profileData.philosophy,
      sectors: profileData.sectors,
      regions: profileData.regions,
    },
  });
  console.log("✅ Profile seeded");

  // Seed Case Studies
  console.log("📚 Seeding case studies...");
  for (const caseStudy of caseStudiesData) {
    await prisma.caseStudy.upsert({
      where: { id: caseStudy.id },
      update: {
        title: caseStudy.title,
        client: caseStudy.client,
        sector: caseStudy.sector,
        contractValue: caseStudy.contractValue,
        country: caseStudy.country,
        description: caseStudy.description,
        keyAchievements: caseStudy.keyAchievements,
        image: caseStudy.image,
        featured: caseStudy.featured,
      },
      create: {
        id: caseStudy.id,
        title: caseStudy.title,
        client: caseStudy.client,
        sector: caseStudy.sector,
        contractValue: caseStudy.contractValue,
        country: caseStudy.country,
        description: caseStudy.description,
        keyAchievements: caseStudy.keyAchievements,
        image: caseStudy.image,
        featured: caseStudy.featured,
      },
    });
  }
  console.log(`✅ ${caseStudiesData.length} case studies seeded`);

  // Seed Insights
  console.log("💡 Seeding insights...");
  for (const insight of insightsData) {
    await prisma.insight.upsert({
      where: { id: insight.id },
      update: {
        title: insight.title,
        excerpt: insight.excerpt,
        content: insight.content,
        category: insight.category,
        date: insight.date,
        readTime: insight.readTime,
        featured: insight.featured,
      },
      create: {
        id: insight.id,
        title: insight.title,
        excerpt: insight.excerpt,
        content: insight.content,
        category: insight.category,
        date: insight.date,
        readTime: insight.readTime,
        featured: insight.featured,
      },
    });
  }
  console.log(`✅ ${insightsData.length} insights seeded`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

