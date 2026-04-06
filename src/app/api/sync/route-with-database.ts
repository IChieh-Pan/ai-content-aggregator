import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { syncFeeds } from "@/lib/aggregation";

export async function POST() {
  try {
    // Fetch active sources from the database
    const dbSources = await prisma.contentSource.findMany({
      where: { isActive: true },
    });

    // Map DB sources to the FeedSource format expected by syncFeeds
    const feedSources = dbSources.map((s) => ({
      id: s.id,
      name: s.name,
      url: s.url,
      category: "",
    }));

    if (feedSources.length === 0) {
      return NextResponse.json(
        { error: "No active content sources configured" },
        { status: 400 },
      );
    }

    const result = await syncFeeds(feedSources);

    // Save processed items to the database
    let saved = 0;
    let skipped = 0;

    for (const item of result.processedItems) {
      if (!item.url) {
        skipped++;
        continue;
      }

      try {
        await prisma.contentItem.upsert({
          where: { url: item.url },
          update: {
            title: item.title,
            description: item.description,
            contentType: item.contentType,
            tags: JSON.stringify(item.tags),
            processorType: "basic",
            qualityScore: item.qualityScore,
          },
          create: {
            title: item.title,
            description: item.description,
            url: item.url,
            contentType: item.contentType,
            tags: JSON.stringify(item.tags),
            processorType: "basic",
            qualityScore: item.qualityScore,
            sourceId: item.sourceId,
            publishedAt: item.publishedAt ?? new Date(),
          },
        });
        saved++;
      } catch {
        skipped++;
      }
    }

    // Update lastSyncAt for successful sources
    for (const source of dbSources) {
      const hadError = result.errors.some((e) => e.source === source.name);
      if (!hadError) {
        await prisma.contentSource.update({
          where: { id: source.id },
          data: { lastSyncAt: new Date() },
        });
      }
    }

    return NextResponse.json({
      totalFeeds: result.totalFeeds,
      successfulFeeds: result.successfulFeeds,
      failedFeeds: result.failedFeeds,
      totalItems: result.totalItems,
      saved,
      skipped,
      errors: result.errors,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
