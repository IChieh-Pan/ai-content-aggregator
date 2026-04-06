import type {
  ContentType,
  ProcessingResult,
  ProcessorType,
  RSSFeedItem,
} from "@/lib/types";

// Re-export shared types used by the processor
export type { ContentType, ProcessingResult, ProcessorType, RSSFeedItem };

export interface RawContent {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  sourceId: string;
  publishedAt: Date;
  author?: string;
}

export interface ProcessedContent {
  id: string;
  rawContentId: string;
  title: string;
  summary: string;
  keywords: string[];
  tags: string[];
  category: ContentCategory;
  relevanceScore: number;
  processedAt: Date;
  processorName: string;
}

export type ContentCategory =
  | "ux-research"
  | "ui-design"
  | "interaction-design"
  | "accessibility"
  | "design-systems"
  | "user-testing"
  | "information-architecture"
  | "visual-design"
  | "prototyping"
  | "design-thinking"
  | "general";

export interface ContentProcessor {
  name: string;
  version: string;
  process(content: RawContent): Promise<ProcessedContent>;
  processRSSItem(item: RSSFeedItem): Promise<ProcessingResult>;
  extractKeywords(text: string): string[];
  categorize(content: RawContent): ContentCategory;
  calculateRelevance(content: RawContent, keywords: string[]): number;
}

export interface ProcessorConfig {
  maxKeywords: number;
  minRelevanceScore: number;
  customStopWords?: string[];
  categoryWeights?: Partial<Record<ContentCategory, number>>;
}
