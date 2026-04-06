import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Map publication names to their domains for targeted searches
function getSourceDomain(sourceName: string): string {
  const domainMap: { [key: string]: string } = {
    "Nielsen Norman Group": "nngroup.com",
    "UX Collective": "uxdesign.cc",
    "UX Planet": "uxplanet.org",
    "A List Apart": "alistapart.com",
    "Smashing Magazine": "smashingmagazine.com",
    "UX Mastery": "uxmastery.com",
    "UXPin": "uxpin.com",
    "Figma": "figma.com",
    "Adobe": "adobe.com",
    "Medium": "medium.com"
  };

  return domainMap[sourceName] || "medium.com";
}

export async function POST() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a UX content curator specializing in AI+Design. Create 8-12 high-quality content recommendations about the intersection of AI and UX design.

Focus on these topics:
- AI in UX design processes and tools
- Human-centered AI design principles
- AI ethics and accessibility in design
- Conversational UI and voice interfaces
- AI-powered personalization in UX
- Design systems and AI automation
- User research with AI tools
- AI transparency and explainability in design

For each recommendation, provide:
1. Title (compelling and specific to current AI+UX trends)
2. Description (2-3 sentences explaining key insights and actionable takeaways)
3. Source (realistic publication name like "Nielsen Norman Group", "UX Collective", "A List Apart", etc.)
4. ContentType (article, tool, or video)
5. Tags (3-5 relevant tags)
6. QualityScore (0.0-1.0 based on relevance and actionability for UX designers)
7. SearchQuery (search terms that would help find this type of content)

Return as JSON array with this structure:
[
  {
    "title": "Designing Ethical AI Interfaces: A UX Framework",
    "description": "Comprehensive guide to implementing ethical considerations in AI-powered interfaces. Covers transparency patterns, bias detection methods, and user agency principles that every UX designer should know.",
    "source": "Nielsen Norman Group",
    "contentType": "article",
    "tags": ["ai-ethics", "ux-framework", "interface-design", "transparency"],
    "qualityScore": 0.92,
    "searchQuery": "ethical AI UX design framework transparency"
  }
]

Focus on actionable insights, current trends, and practical frameworks for UX designers working with AI in 2026.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text;
    if (text.includes("```json")) {
      jsonText = text.split("```json")[1].split("```")[0];
    } else if (text.includes("```")) {
      jsonText = text.split("```")[1].split("```")[0];
    }

    try {
      const curatedContent = JSON.parse(jsonText);

      // Add metadata and create functional URLs
      const responseData = {
        status: "SUCCESS",
        message: "Content curated successfully by Gemini AI",
        curatedAt: new Date().toISOString(),
        totalItems: curatedContent.length,
        source: "gemini-ai-curator",
        items: curatedContent.map((item: any, index: number) => {
          // Create search URLs based on the search query and source
          const searchQuery = encodeURIComponent(item.searchQuery || item.title);
          const sourceQuery = item.source ? encodeURIComponent(`site:${getSourceDomain(item.source)} ${item.searchQuery || item.title}`) : searchQuery;

          return {
            id: `gemini-${Date.now()}-${index}`,
            title: item.title,
            description: item.description,
            url: `https://www.google.com/search?q=${sourceQuery}`,
            source: item.source,
            contentType: item.contentType || "article",
            tags: item.tags || [],
            qualityScore: item.qualityScore || 0.8,
            publishedAt: new Date().toISOString().split('T')[0], // Today's date
            processorType: "ai",
            searchQuery: item.searchQuery
          };
        })
      };

      return NextResponse.json(responseData);

    } catch (parseError) {
      console.error("Failed to parse Gemini response:", parseError);
      return NextResponse.json({
        status: "PARSE_ERROR",
        error: "Failed to parse AI response",
        rawResponse: text.substring(0, 500) + "..."
      }, { status: 500 });
    }

  } catch (error) {
    console.error("Content curation failed:", error);
    return NextResponse.json({
      status: "ERROR",
      error: error instanceof Error ? error.message : "Content curation failed",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "OK",
    message: "Gemini AI Content Curator",
    description: "POST to this endpoint to get AI-curated UX+AI content",
    requiredEnvVars: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Missing"
    }
  });
}