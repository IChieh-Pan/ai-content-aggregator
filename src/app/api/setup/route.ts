import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const defaultSources = [
  {
    name: "Nielsen Norman Group",
    type: "rss",
    url: "https://www.nngroup.com/feed/rss/",
  },
  {
    name: "Smashing Magazine",
    type: "rss",
    url: "https://www.smashingmagazine.com/feed/",
  },
  {
    name: "A List Apart",
    type: "rss",
    url: "https://alistapart.com/main/feed/",
  },
  {
    name: "UX Collective",
    type: "rss",
    url: "https://uxdesign.cc/feed",
  },
  {
    name: "CSS-Tricks",
    type: "rss",
    url: "https://css-tricks.com/feed/",
  },
  {
    name: "UX Planet",
    type: "rss",
    url: "https://uxplanet.org/feed",
  },
  {
    name: "Baymard Institute",
    type: "rss",
    url: "https://baymard.com/blog.atom",
  },
  {
    name: "UX Booth",
    type: "rss",
    url: "https://www.uxbooth.com/feed/",
  },
];

export async function POST() {
  try {
    console.log("🌱 Setting up database...");

    // Create content sources
    let created = 0;
    let skipped = 0;

    for (const source of defaultSources) {
      try {
        await prisma.contentSource.upsert({
          where: { url: source.url },
          update: {},
          create: source,
        });
        created++;
      } catch (error) {
        console.error(`Failed to create source ${source.name}:`, error);
        skipped++;
      }
    }

    console.log(`✅ Setup complete: ${created} sources created, ${skipped} skipped`);

    return NextResponse.json({
      message: "Database setup complete!",
      sourcesCreated: created,
      sourcesSkipped: skipped,
      totalSources: defaultSources.length,
      nextStep: "Visit /api/sync to populate with content"
    });
  } catch (error) {
    console.error("❌ Setup failed:", error);
    return NextResponse.json(
      { error: "Setup failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}