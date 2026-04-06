import { BasicContentProcessor } from "@/lib/content-processor";
import type { RSSFeedItem } from "@/lib/types";
import { fetchAllFeeds, type FetchResult } from "./feed-parser";
import { DEFAULT_FEED_SOURCES, type FeedSource } from "./sources";

export interface SyncResult {
  totalFeeds: number;
  successfulFeeds: number;
  failedFeeds: number;
  totalItems: number;
  processedItems: ProcessedItem[];
  errors: { source: string; error: string }[];
}

export interface ProcessedItem {
  sourceId: string;
  sourceName: string;
  title: string;
  url: string;
  description: string | null;
  publishedAt: Date | null;
  contentType: string;
  tags: string[];
  qualityScore: number | null;
  keywords: string[];
  category: string;
  summary: string;
}

const processor = new BasicContentProcessor();

function toProcessedItem(
  item: RSSFeedItem,
  source: FeedSource,
  processingResult: Awaited<ReturnType<typeof processor.processRSSItem>>,
): ProcessedItem {
  return {
    sourceId: source.id,
    sourceName: source.name,
    title: item.title,
    url: item.link,
    description: item.description || null,
    publishedAt: item.pubDate ? new Date(item.pubDate) : null,
    contentType: processingResult.contentType,
    tags: processingResult.tags,
    qualityScore: processingResult.qualityScore ?? null,
    keywords: processingResult.extractedData?.keywords || [],
    category: processingResult.extractedData?.category || "general",
    summary: processingResult.extractedData?.summary || "",
  };
}

export async function syncFeeds(
  sources: FeedSource[] = DEFAULT_FEED_SOURCES,
): Promise<SyncResult> {
  const results: FetchResult[] = await fetchAllFeeds(sources);

  const errors: { source: string; error: string }[] = [];
  const processedItems: ProcessedItem[] = [];
  let successfulFeeds = 0;
  let failedFeeds = 0;

  for (const result of results) {
    if (result.error || !result.feed) {
      failedFeeds++;
      errors.push({
        source: result.source.name,
        error: result.error || "No feed data",
      });
      continue;
    }

    successfulFeeds++;

    for (const item of result.feed.items) {
      try {
        const processingResult = await processor.processRSSItem(item);
        processedItems.push(
          toProcessedItem(item, result.source, processingResult),
        );
      } catch {
        errors.push({
          source: result.source.name,
          error: `Failed to process item: ${item.title}`,
        });
      }
    }
  }

  return {
    totalFeeds: sources.length,
    successfulFeeds,
    failedFeeds,
    totalItems: processedItems.length,
    processedItems,
    errors,
  };
}

// CLI entry point for `npm run sync:content`
if (require.main === module) {
  (async () => {
    console.log("Starting content sync...");
    console.log(`Fetching from ${DEFAULT_FEED_SOURCES.length} sources...`);

    const result = await syncFeeds();

    console.log(`\nSync complete:`);
    console.log(`  Feeds: ${result.successfulFeeds}/${result.totalFeeds} successful`);
    console.log(`  Items: ${result.totalItems} processed`);

    if (result.errors.length > 0) {
      console.log(`  Errors: ${result.errors.length}`);
      for (const err of result.errors) {
        console.log(`    - [${err.source}] ${err.error}`);
      }
    }

    // Print sample of processed items
    const sample = result.processedItems.slice(0, 3);
    if (sample.length > 0) {
      console.log(`\nSample processed items:`);
      for (const item of sample) {
        console.log(`  "${item.title}"`);
        console.log(`    Source: ${item.sourceName}`);
        console.log(`    Type: ${item.contentType} | Category: ${item.category}`);
        console.log(`    Tags: ${item.tags.join(", ") || "none"}`);
        console.log(`    Keywords: ${item.keywords.slice(0, 5).join(", ")}`);
        console.log(`    Score: ${item.qualityScore?.toFixed(2) ?? "N/A"}`);
      }
    }
  })();
}
