#!/usr/bin/env tsx
/**
 * Add profileImage column to Profile table
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addProfileImage() {
  console.log("🔄 Adding profileImage column...");

  try {
    // Add the profileImage column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Profile" 
      ADD COLUMN IF NOT EXISTS "profileImage" TEXT
    `);
    console.log("✅ Added profileImage column");

    // Set default value to the About page image
    await prisma.$executeRawUnsafe(`
      UPDATE "Profile" SET 
        "profileImage" = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop'
      WHERE "id" = 'profile' AND "profileImage" IS NULL
    `);
    console.log("✅ Set default profile image");

    console.log("🎉 Migration completed successfully!");
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log("⚠️  Column already exists. Checking if default value needs to be set...");
      
      try {
        await prisma.$executeRawUnsafe(`
          UPDATE "Profile" SET 
            "profileImage" = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop'
          WHERE "id" = 'profile' AND "profileImage" IS NULL
        `);
        console.log("✅ Set default profile image");
        console.log("🎉 Migration appears to be already applied!");
      } catch (updateError: any) {
        console.error("❌ Error setting default value:", updateError.message);
      }
    } else {
      console.error("❌ Migration failed:", error.message);
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

addProfileImage();

