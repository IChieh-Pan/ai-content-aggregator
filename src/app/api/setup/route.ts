import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { RSS_SOURCES } from "@/lib/data/rss-sources";

export async function POST() {
  try {
    console.log("🌱 Setting up database with real UX/AI RSS sources...");

    let created = 0;
    let skipped = 0;

    for (const source of RSS_SOURCES) {
      try {
        await prisma.contentSource.upsert({
          where: { url: source.url },
          update: {
            name: source.name,
            type: source.type,
            isActive: true,
          },
          create: {
            name: source.name,
            type: source.type,
            url: source.url,
            isActive: true,
          },
        });
        created++;
      } catch (error) {
        console.error(`Failed to create source ${source.name}:`, error);
        skipped++;
      }
    }

    console.log(`✅ Setup complete: ${created} sources created, ${skipped} skipped`);

    return NextResponse.json({
      message: "Database setup complete with real UX/AI RSS sources!",
      sourcesCreated: created,
      sourcesSkipped: skipped,
      totalSources: RSS_SOURCES.length,
      sources: RSS_SOURCES.map(s => ({ name: s.name, url: s.url })),
      nextStep: "Visit /api/sync to fetch real content from these sources"
    });
  } catch (error) {
    console.error("❌ Setup failed:", error);
    return NextResponse.json(
      { error: "Setup failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sources = await prisma.contentSource.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      status: "OK",
      totalSources: sources.length,
      sources: sources.map(s => ({
        id: s.id,
        name: s.name,
        url: s.url,
        type: s.type,
        isActive: s.isActive,
        lastSyncAt: s.lastSyncAt,
        createdAt: s.createdAt,
      }))
    });
  } catch (err) {
    console.error("Failed to fetch sources:", err);
    const message = err instanceof Error ? err.message : "Failed to fetch sources";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}