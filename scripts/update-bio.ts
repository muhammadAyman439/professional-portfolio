#!/usr/bin/env tsx
/**
 * Update profile bio in database
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateBio() {
  console.log("🔄 Updating profile bio...");

  const newBioFull = `With 6+ years of experience in RFPs, tenders, grants, and business development, I bridge the gap between technical teams, pricing strategists, and client stakeholders to deliver customized, winning proposals. Whether it's a government TOR, a donor-funded RFQ, or a competitive NGO grant, I bring structure, strategy, and speed to every bid cycle.

I specialize in:

• Managing full bid lifecycles for complex service proposals
• Writing compelling narratives in both English and Arabic
• Aligning financial justifications with technical value
• Designing and automating internal proposal systems
• Coaching junior writers and building scalable bid units

What sets me apart?

I don't just submit proposals—I build pipelines, tell winning stories, and drive measurable results. I've increased win rates by 150%, improved internal workflows by 35%, and helped organizations shift from reactive bidding to proactive growth.

Currently leading the Proposals Department at EYouth, I work on regional bids for digital transformation, capacity building, training, and managed services.

Let's connect if you're looking for someone who knows how to turn an RFP into a strategic growth opportunity.`;

  try {
    await prisma.profile.update({
      where: { id: "profile" },
      data: {
        bioFull: newBioFull,
      },
    });
    console.log("✅ Bio updated successfully!");
  } catch (error: any) {
    console.error("❌ Update failed:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateBio();

