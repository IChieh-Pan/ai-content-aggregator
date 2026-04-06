import { NextRequest, NextResponse } from "next/server";
import type { ContentType } from "@/lib/types";

// Sample high-quality UX+AI content with diverse types as fallback
const SAMPLE_CONTENT = [
  {
    id: "ai-design-systems-2026",
    title: "AI-Powered Design Systems: Automating Design at Scale",
    description: "Explore how AI is transforming design systems by automatically generating components, maintaining consistency, and adapting to user behavior patterns. Learn practical implementation strategies for 2026.",
    url: "https://www.google.com/search?q=site:uxdesign.cc+AI+design+systems+automation+2026",
    contentType: "article" as ContentType,
    tags: ["ai-ux", "design-systems", "automation", "scalability"],
    qualityScore: 0.92,
    publishedAt: new Date("2026-04-05"),
    sourceId: "sample",
    processorType: "ai"
  },
  {
    id: "figma-ai-plugin-autoflow",
    title: "AutoFlow AI: Figma Plugin for Smart Layout Generation",
    description: "Revolutionary AI plugin that automatically creates responsive layouts from sketches. Uses machine learning to understand design patterns and generate production-ready components in seconds.",
    url: "https://www.producthunt.com/search?q=Figma+AI+layout+automation+plugin",
    contentType: "tool" as ContentType,
    tags: ["figma-plugin", "ai-tools", "layout-automation", "productivity"],
    qualityScore: 0.89,
    publishedAt: new Date("2026-04-04"),
    sourceId: "sample",
    processorType: "ai"
  },
  {
    id: "design-better-ai-episode",
    title: "The Future of AI in Design Teams",
    description: "In-depth podcast discussion with leading design teams about integrating AI into design workflows. Features real case studies from Airbnb, Spotify, and emerging AI-first design companies.",
    url: "https://www.google.com/search?q=AI+design+teams+workflow+podcast+case+studies",
    contentType: "podcast" as ContentType,
    tags: ["design-teams", "ai-workflow", "case-studies", "leadership"],
    qualityScore: 0.87,
    publishedAt: new Date("2026-04-03"),
    sourceId: "sample",
    processorType: "ai"
  },
  {
    id: "youtube-ai-ux-tutorial",
    title: "Building AI-First UX: Complete Tutorial Series",
    description: "Comprehensive video series covering everything from AI user research to implementation of smart interfaces. Includes hands-on coding examples and design system integration.",
    url: "https://www.youtube.com/results?search_query=AI+UX+design+tutorial+2026+hands+on",
    contentType: "video" as ContentType,
    tags: ["tutorial", "ai-implementation", "hands-on", "video-series"],
    qualityScore: 0.85,
    publishedAt: new Date("2026-04-02"),
    sourceId: "sample",
    processorType: "ai"
  },
  {
    id: "human-centered-ai-book",
    title: "Human-Centered AI Design: A Practitioner's Guide",
    description: "Comprehensive book covering ethical AI implementation in user interfaces. Written by leading researchers and practitioners, with real-world case studies and actionable frameworks for 2026.",
    url: "https://www.google.com/search?q=site:oreilly.com+human+centered+AI+design+book+2026",
    contentType: "book" as ContentType,
    tags: ["ai-ethics", "human-centered-design", "frameworks", "research"],
    qualityScore: 0.94,
    publishedAt: new Date("2026-04-01"),
    sourceId: "sample",
    processorType: "ai"
  },
  {
    id: "voice-ui-accessibility",
    title: "Making Voice AI Interfaces Accessible for Everyone",
    description: "Essential guidelines and practical techniques for designing inclusive voice interfaces. Covers speech recognition challenges, alternative inputs, and multi-modal accessibility patterns.",
    url: "https://www.google.com/search?q=site:nngroup.com+voice+AI+accessibility+inclusive+design",
    contentType: "article" as ContentType,
    tags: ["voice-ui", "accessibility", "inclusive-design", "multimodal"],
    qualityScore: 0.91,
    publishedAt: new Date("2026-03-31"),
    sourceId: "sample",
    processorType: "ai"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "12", 10);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const types = searchParams
      .get("types")
      ?.split(",")
      .filter(Boolean) as ContentType[] | undefined;
    const useAI = searchParams.get("ai") === "true";

    let items = SAMPLE_CONTENT;

    // If AI curation is requested, try to get fresh content from Gemini
    if (useAI) {
      try {
        const baseUrl = request.nextUrl.origin;
        const curateResponse = await fetch(`${baseUrl}/api/curate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });

        if (curateResponse.ok) {
          const curatedData = await curateResponse.json();
          if (curatedData.status === "SUCCESS" && curatedData.items) {
            items = curatedData.items;
          }
        }
      } catch (aiError) {
        console.error("AI curation failed, using sample content:", aiError);
        // Continue with sample content
      }
    }

    // Apply filters
    if (query) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    if (types && types.length > 0) {
      items = items.filter(item => types.includes(item.contentType));
    }

    // Apply pagination
    const total = items.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = items.slice(startIndex, startIndex + pageSize);

    return NextResponse.json({
      items: paginatedItems,
      total,
      page,
      pageSize,
      hasMore: startIndex + pageSize < total,
      source: useAI ? "gemini-ai-curator" : "sample-content",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}