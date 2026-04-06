import type { ContentType, ProcessingResult, RSSFeedItem } from "@/lib/types";
import { extractKeywords, generateTags } from "./keywords";
import type {
  ContentCategory,
  ContentProcessor,
  ProcessedContent,
  ProcessorConfig,
  RawContent,
} from "./types";

const CATEGORY_KEYWORDS: Record<ContentCategory, string[]> = {
  "ux-research": ["research", "study", "findings", "insights", "data", "survey", "interview", "observation", "ethnography", "contextual inquiry"],
  "ui-design": ["interface", "ui", "visual", "layout", "component", "button", "form", "input", "screen"],
  "interaction-design": ["interaction", "animation", "transition", "gesture", "click", "hover", "state", "flow"],
  "accessibility": ["accessibility", "a11y", "wcag", "aria", "screen reader", "contrast", "keyboard", "assistive"],
  "design-systems": ["design system", "component library", "tokens", "atomic", "pattern library", "styleguide"],
  "user-testing": ["testing", "a/b test", "usability test", "analytics", "metrics", "conversion", "heatmap"],
  "information-architecture": ["information architecture", "navigation", "sitemap", "taxonomy", "labeling", "search"],
  "visual-design": ["typography", "color", "spacing", "grid", "iconography", "illustration", "branding"],
  "prototyping": ["prototype", "wireframe", "mockup", "figma", "sketch", "adobe xd", "invision"],
  "design-thinking": ["design thinking", "ideation", "empathy", "define", "brainstorm", "workshop", "co-creation"],
  "general": [],
};

const CATEGORY_TO_CONTENT_TYPE: Record<ContentCategory, ContentType> = {
  "ux-research": "article",
  "ui-design": "article",
  "interaction-design": "article",
  "accessibility": "article",
  "design-systems": "tool",
  "user-testing": "article",
  "information-architecture": "article",
  "visual-design": "article",
  "prototyping": "tool",
  "design-thinking": "article",
  "general": "article",
};

const DEFAULT_CONFIG: ProcessorConfig = {
  maxKeywords: 10,
  minRelevanceScore: 0.1,
};

export class BasicContentProcessor implements ContentProcessor {
  name = "basic";
  version = "1.0.0";
  private config: ProcessorConfig;

  constructor(config: Partial<ProcessorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async process(content: RawContent): Promise<ProcessedContent> {
    const fullText = `${content.title} ${content.description} ${content.content}`;
    const keywords = this.extractKeywords(fullText);
    const tags = generateTags(keywords);
    const category = this.categorize(content);
    const relevanceScore = this.calculateRelevance(content, keywords);

    return {
      id: `processed-${content.id}`,
      rawContentId: content.id,
      title: content.title,
      summary: this.generateSummary(content.description || content.content),
      keywords,
      tags,
      category,
      relevanceScore,
      processedAt: new Date(),
      processorName: this.name,
    };
  }

  async processRSSItem(item: RSSFeedItem): Promise<ProcessingResult> {
    const raw: RawContent = {
      id: item.link,
      title: item.title,
      description: item.description || "",
      content: item.content || "",
      url: item.link,
      sourceId: "",
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    };

    const fullText = `${raw.title} ${raw.description} ${raw.content}`;
    const keywords = this.extractKeywords(fullText);
    const tags = [
      ...generateTags(keywords),
      ...(item.categories || []),
    ];
    const category = this.categorize(raw);
    const relevanceScore = this.calculateRelevance(raw, keywords);

    return {
      contentType: CATEGORY_TO_CONTENT_TYPE[category],
      tags: [...new Set(tags)],
      qualityScore: relevanceScore,
      extractedData: {
        keywords,
        category,
        summary: this.generateSummary(raw.description || raw.content),
      },
    };
  }

  extractKeywords(text: string): string[] {
    return extractKeywords(
      text,
      this.config.maxKeywords,
      this.config.customStopWords,
    );
  }

  categorize(content: RawContent): ContentCategory {
    const fullText =
      `${content.title} ${content.description} ${content.content}`.toLowerCase();
    const scores: Partial<Record<ContentCategory, number>> = {};
    const weights = this.config.categoryWeights || {};

    for (const [category, terms] of Object.entries(CATEGORY_KEYWORDS)) {
      const cat = category as ContentCategory;
      if (cat === "general") continue;

      let score = 0;
      for (const term of terms) {
        const regex = new RegExp(`\\b${term}\\b`, "gi");
        const matches = fullText.match(regex);
        if (matches) {
          score += matches.length;
        }
      }

      score *= weights[cat] || 1;
      if (score > 0) {
        scores[cat] = score;
      }
    }

    const entries = Object.entries(scores) as [ContentCategory, number][];
    if (entries.length === 0) return "general";

    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }

  calculateRelevance(content: RawContent, keywords: string[]): number {
    const fullText =
      `${content.title} ${content.description} ${content.content}`.toLowerCase();

    let score = 0;
    const maxScore = keywords.length * 3;

    for (const keyword of keywords) {
      if (content.title.toLowerCase().includes(keyword)) {
        score += 3;
      } else if (content.description.toLowerCase().includes(keyword)) {
        score += 2;
      } else if (fullText.includes(keyword)) {
        score += 1;
      }
    }

    return maxScore > 0 ? Math.min(score / maxScore, 1) : 0;
  }

  private generateSummary(text: string, maxLength: number = 200): string {
    const cleaned = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    if (cleaned.length <= maxLength) return cleaned;

    const truncated = cleaned.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + "...";
  }
}
