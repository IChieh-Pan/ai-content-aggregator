import RSSParser from "rss-parser";
import type { RSSFeed, RSSFeedItem } from "@/lib/types";
import type { FeedSource } from "./sources";

const parser = new RSSParser({
  timeout: 10000,
  headers: {
    "User-Agent": "AI-Content-Aggregator/1.0",
  },
});

export interface FetchResult {
  source: FeedSource;
  feed: RSSFeed | null;
  error: string | null;
}

export async function fetchFeed(source: FeedSource): Promise<FetchResult> {
  try {
    const raw = await parser.parseURL(source.url);

    const items: RSSFeedItem[] = (raw.items || []).map((item) => ({
      title: item.title || "Untitled",
      description: item.contentSnippet || item.summary || undefined,
      link: item.link || "",
      pubDate: item.pubDate || item.isoDate || undefined,
      content: item["content:encoded"] || item.content || undefined,
      categories: item.categories || undefined,
    }));

    const feed: RSSFeed = {
      title: raw.title || source.name,
      description: raw.description || "",
      link: raw.link || source.url,
      items,
    };

    return { source, feed, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { source, feed: null, error: message };
  }
}

export async function fetchAllFeeds(
  sources: FeedSource[],
): Promise<FetchResult[]> {
  const results = await Promise.allSettled(
    sources.map((source) => fetchFeed(source)),
  );

  return results.map((result) => {
    if (result.status === "fulfilled") return result.value;
    return {
      source: { id: "unknown", name: "Unknown", url: "", category: "" },
      feed: null,
      error: result.reason?.message || "Unknown error",
    };
  });
}
