#!/usr/bin/env tsx
/**
 * Database Backup Script
 * 
 * Exports all data from PostgreSQL to JSON files
 * Usage: pnpm tsx scripts/backup-db.ts
 */

import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function backup() {
  console.log("🔄 Starting database backup...");

  try {
    // Fetch all data
    const profile = await prisma.profile.findUnique({ 
      where: { id: "profile" } 
    });
    const caseStudies = await prisma.caseStudy.findMany({
      orderBy: { createdAt: "desc" },
    });
    const insights = await prisma.insight.findMany({
      orderBy: { date: "desc" },
    });

    if (!profile) {
      throw new Error("Profile not found in database");
    }

    // Transform profile back to original format
    const profileData = {
      name: profile.name,
      title: profile.title,
      tagline: profile.tagline,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      linkedin: profile.linkedin,
      twitter: profile.twitter,
      stats: {
        yearsOfExperience: profile.statsYearsOfExperience,
        totalFundingSecured: profile.statsTotalFundingSecured,
        countries: profile.statsCountries,
        winningRate: profile.statsWinningRate,
      },
      bio: {
        short: profile.bioShort,
        full: profile.bioFull,
      },
      mission: profile.mission,
      philosophy: profile.philosophy,
      sectors: profile.sectors,
      regions: profile.regions,
    };

    // Create backups directory
    const backupDir = path.join(__dirname, "..", "backups");
    await mkdir(backupDir, { recursive: true });

    // Generate timestamp for backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(backupDir, `backup-${timestamp}`);
    await mkdir(backupPath, { recursive: true });

    // Write files
    await Promise.all([
      writeFile(
        path.join(backupPath, "profile.json"),
        JSON.stringify(profileData, null, 2)
      ),
      writeFile(
        path.join(backupPath, "caseStudies.json"),
        JSON.stringify(caseStudies, null, 2)
      ),
      writeFile(
        path.join(backupPath, "insights.json"),
        JSON.stringify(insights, null, 2)
      ),
    ]);

    // Also create a "latest" backup
    const latestPath = path.join(backupDir, "latest");
    await mkdir(latestPath, { recursive: true });
    
    await Promise.all([
      writeFile(
        path.join(latestPath, "profile.json"),
        JSON.stringify(profileData, null, 2)
      ),
      writeFile(
        path.join(latestPath, "caseStudies.json"),
        JSON.stringify(caseStudies, null, 2)
      ),
      writeFile(
        path.join(latestPath, "insights.json"),
        JSON.stringify(insights, null, 2)
      ),
    ]);

    console.log("✅ Backup completed successfully!");
    console.log(`📁 Backup location: ${backupPath}`);
    console.log(`📁 Latest backup: ${latestPath}`);
    console.log("");
    console.log("📊 Backup summary:");
    console.log(`   - Profile: 1 record`);
    console.log(`   - Case Studies: ${caseStudies.length} records`);
    console.log(`   - Insights: ${insights.length} records`);
  } catch (error) {
    console.error("❌ Backup failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

backup();

