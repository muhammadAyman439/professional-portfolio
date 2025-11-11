#!/usr/bin/env tsx
/**
 * Run manual migration to update stats fields
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runMigration() {
  console.log("🔄 Running stats fields migration...");

  try {
    // Rename columns
    await prisma.$executeRawUnsafe(`ALTER TABLE "Profile" RENAME COLUMN "statsYears" TO "statsYearsOfExperience"`);
    console.log("✅ Renamed statsYears to statsYearsOfExperience");

    await prisma.$executeRawUnsafe(`ALTER TABLE "Profile" RENAME COLUMN "statsProposals" TO "statsTotalFundingSecured"`);
    console.log("✅ Renamed statsProposals to statsTotalFundingSecured");

    await prisma.$executeRawUnsafe(`ALTER TABLE "Profile" RENAME COLUMN "statsClients" TO "statsCountries"`);
    console.log("✅ Renamed statsClients to statsCountries");

    await prisma.$executeRawUnsafe(`ALTER TABLE "Profile" RENAME COLUMN "statsSuccessRate" TO "statsWinningRate"`);
    console.log("✅ Renamed statsSuccessRate to statsWinningRate");

    // Update values
    await prisma.$executeRawUnsafe(`
      UPDATE "Profile" SET 
        "statsYearsOfExperience" = '+6',
        "statsTotalFundingSecured" = '$M12+',
        "statsCountries" = '5+',
        "statsWinningRate" = '75%'
      WHERE "id" = 'profile'
    `);
    console.log("✅ Updated stats values");

    console.log("🎉 Migration completed successfully!");
  } catch (error: any) {
    if (error.message.includes('column') && error.message.includes('does not exist')) {
      console.log("⚠️  Columns already migrated or don't exist. Checking if new columns exist...");
      
      // Try updating with new column names
      try {
        await prisma.$executeRawUnsafe(`
          UPDATE "Profile" SET 
            "statsYearsOfExperience" = '+6',
            "statsTotalFundingSecured" = '$M12+',
            "statsCountries" = '5+',
            "statsWinningRate" = '75%'
          WHERE "id" = 'profile'
        `);
        console.log("✅ Updated stats values with new column names");
        console.log("🎉 Migration appears to be already applied!");
      } catch (updateError: any) {
        console.error("❌ Error updating values:", updateError.message);
        throw updateError;
      }
    } else {
      console.error("❌ Migration failed:", error.message);
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();

