import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
You are a UX content curator specializing in AI+Design. Find and curate 8-12 high-quality, recent articles about the intersection of AI and UX design.

Focus on these topics:
- AI in UX design processes and tools
- Human-centered AI design
- AI ethics and accessibility in design
- Conversational UI and voice interfaces
- AI-powered personalization in UX
- Design systems and AI automation
- User research with AI tools
- AI transparency and explainability in design

For each article, provide:
1. Title (compelling and accurate)
2. Description (2-3 sentences explaining key insights)
3. URL (real, working link - prefer recent content from last 30 days)
4. Source (publication name)
5. ContentType (article, tool, or video)
6. Tags (3-5 relevant tags)
7. QualityScore (0.0-1.0 based on relevance and quality)

Return as JSON array with this structure:
[
  {
    "title": "Article title",
    "description": "Brief description of key insights...",
    "url": "https://example.com/article",
    "source": "Publication Name",
    "contentType": "article",
    "tags": ["ai-ux", "design-systems", "accessibility"],
    "qualityScore": 0.85,
    "publishedAt": "2026-04-06"
  }
]

Focus on actionable insights for UX designers working with AI. Prioritize quality over quantity.
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

      // Add metadata
      const responseData = {
        status: "SUCCESS",
        message: "Content curated successfully by Gemini AI",
        curatedAt: new Date().toISOString(),
        totalItems: curatedContent.length,
        source: "gemini-ai-curator",
        items: curatedContent.map((item: any, index: number) => ({
          id: `gemini-${Date.now()}-${index}`,
          ...item,
          processorType: "ai",
        }))
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