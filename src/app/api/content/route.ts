import { NextRequest, NextResponse } from "next/server";
import type { ContentType } from "@/lib/types";

// Sample high-quality UX+AI content as fallback with working search links
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
    id: "ethical-ai-ux-principles",
    title: "Building Ethical AI into UX: A Designer's Guide",
    description: "Essential principles and practical frameworks for integrating ethical AI considerations into UX design processes. Covers transparency, bias prevention, and user agency in AI-driven interfaces.",
    url: "https://www.google.com/search?q=site:nngroup.com+ethical+AI+UX+design+principles",
    contentType: "article" as ContentType,
    tags: ["ai-ethics", "ux-design", "transparency", "bias-prevention"],
    qualityScore: 0.95,
    publishedAt: new Date("2026-04-04"),
    sourceId: "sample",
    processorType: "ai"
  },
  {
    id: "conversational-ui-patterns",
    title: "Conversational UI Patterns for AI Assistants",
    description: "Comprehensive guide to designing conversational interfaces that feel natural and helpful. Includes best practices for chatbots, voice UI, and multimodal AI interactions.",
    url: "https://www.google.com/search?q=site:uxplanet.org+conversational+UI+patterns+chatbot+design",
    contentType: "article" as ContentType,
    tags: ["conversational-ui", "chatbots", "voice-interface", "ai-interaction"],
    qualityScore: 0.88,
    publishedAt: new Date("2026-04-03"),
    sourceId: "sample",
    processorType: "ai"
  },
  {
    id: "ai-accessibility-design",
    title: "AI-Powered Accessibility: Making Inclusive Design Easier",
    description: "How AI tools are revolutionizing accessibility in design by automatically detecting issues, suggesting improvements, and creating more inclusive user experiences.",
    url: "https://www.google.com/search?q=site:alistapart.com+AI+accessibility+inclusive+design+automation",
    contentType: "article" as ContentType,
    tags: ["accessibility", "ai-tools", "inclusive-design", "automation"],
    qualityScore: 0.90,
    publishedAt: new Date("2026-04-02"),
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