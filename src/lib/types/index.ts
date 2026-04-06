// Core types for the AI Content Aggregator

export type ContentType = 'article' | 'book' | 'podcast' | 'video' | 'tool';

export type ProcessorType = 'basic' | 'manual' | 'ai';

export interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  url: string;
  contentType: ContentType;
  tags: string[];
  processorType: ProcessorType;
  qualityScore: number | null;
  sourceId: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentSource {
  id: string;
  name: string;
  type: 'rss' | 'api' | 'manual';
  url: string;
  isActive: boolean;
  lastSyncAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentProcessor {
  id: string;
  name: string;
  type: ProcessorType;
  config: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  query?: string;
  contentTypes?: ContentType[];
  sources?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  tags?: string[];
}

export interface SearchResult {
  items: ContentItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// RSS Feed types
export interface RSSFeedItem {
  title: string;
  description?: string;
  link: string;
  pubDate?: string;
  content?: string;
  categories?: string[];
}

export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  items: RSSFeedItem[];
}

// Processing results
export interface ProcessingResult {
  contentType: ContentType;
  tags: string[];
  qualityScore?: number;
  extractedData?: Record<string, any>;
}