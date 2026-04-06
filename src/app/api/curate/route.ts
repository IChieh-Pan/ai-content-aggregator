import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Map publication names to their domains for targeted searches
function getSourceDomain(sourceName: string): string {
  const domainMap: { [key: string]: string } = {
    // Articles & Publications
    "Nielsen Norman Group": "nngroup.com",
    "UX Collective": "uxdesign.cc",
    "UX Planet": "uxplanet.org",
    "A List Apart": "alistapart.com",
    "Smashing Magazine": "smashingmagazine.com",
    "UX Mastery": "uxmastery.com",
    "Adobe Blog": "blog.adobe.com",
    "Figma": "figma.com",

    // Tools & Resources
    "Product Hunt": "producthunt.com",
    "UXTools": "uxtools.co",
    "AI Design Tools": "aidesigntools.com",
    "Figma Community": "figma.com/community",

    // Videos & Learning
    "YouTube": "youtube.com",
    "Vimeo": "vimeo.com",
    "Design Conference Archives": "youtube.com",

    // Podcasts
    "Design Better": "designbetter.co",
    "What is Wrong with UX": "podcasts.google.com",
    "User Defenders": "userdefenders.com",
    "The Honest Designers Show": "thehonestdesignersshow.com",

    // Books & Publications
    "O'Reilly": "oreilly.com",
    "A Book Apart": "abookapart.com",
    "Rosenfeld Media": "rosenfeldmedia.com",

    // General
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

    // Add randomization to generate different content each time
    const currentTime = new Date().toISOString();
    const randomSeed = Math.floor(Math.random() * 1000);

    const topicRotations = [
      "AI-powered design tools and workflow automation",
      "Ethical AI considerations and bias prevention in UX",
      "Conversational interfaces and voice-first design",
      "AI personalization and recommendation systems",
      "Design systems automation with AI",
      "AI in user research and data analysis",
      "Accessibility and inclusive AI design",
      "AI transparency and explainable interfaces"
    ];

    const contentMixes = [
      "Mix of articles (40%), tools (30%), videos (20%), podcasts (10%)",
      "Mix of tools (35%), articles (30%), podcasts (25%), books (10%)",
      "Mix of videos (40%), articles (30%), tools (20%), podcasts (10%)",
      "Mix of articles (35%), podcasts (30%), videos (25%), tools (10%)"
    ];

    const focusArea = topicRotations[randomSeed % topicRotations.length];
    const contentMix = contentMixes[randomSeed % contentMixes.length];

    const prompt = `
You are a UX content curator specializing in AI+Design. Create 10-14 DIVERSE content recommendations about AI and UX design.

VARIETY REQUIREMENT: Generate DIFFERENT content each time. Current session: ${currentTime}-${randomSeed}

PRIMARY FOCUS for this curation: "${focusArea}"
CONTENT MIX TARGET: ${contentMix}

TOPICS TO EXPLORE (vary the emphasis each time):
- AI-powered design tools and automation workflows
- Human-centered AI design principles and ethics
- Conversational UI, chatbots, and voice interfaces
- AI personalization and behavioral prediction
- Design systems automation and smart components
- AI in user research, testing, and analytics
- Accessibility tools powered by AI
- Explainable AI and transparency in design
- AI-generated content and creative workflows
- Machine learning for UX optimization

CONTENT TYPES TO INCLUDE:
- **Articles**: Recent blog posts, research papers, case studies
- **Tools**: AI-powered UX/design tools, plugins, platforms
- **Videos**: YouTube tutorials, conference talks, demos
- **Podcasts**: Design podcast episodes, interviews with AI+UX experts
- **Books**: Recent publications about AI in design (2023-2026)

DIVERSE SOURCES (mix these up):
- Articles: "UX Collective", "Nielsen Norman Group", "Smashing Magazine", "A List Apart", "UX Planet", "Adobe Blog"
- Tools: "Product Hunt", "UXTools", "AI Design Tools", "Figma Community"
- Videos: "YouTube", "Vimeo", "Design Conference Archives"
- Podcasts: "Design Better", "What is Wrong with UX", "User Defenders", "The Honest Designers Show"
- Books: "O'Reilly", "A Book Apart", "Rosenfeld Media"

For each recommendation, provide:
1. Title (compelling, specific, and VARIED from previous curations)
2. Description (2-3 sentences with actionable insights)
3. Source (realistic publication/platform name)
4. ContentType (article, tool, video, podcast, or book)
5. Tags (3-5 relevant tags)
6. QualityScore (0.7-1.0 for high-quality content)
7. SearchQuery (specific search terms for finding this content)

Return as JSON array with this structure:
[
  {
    "title": "AI-Powered Figma Plugin: Automated Layout Generation",
    "description": "Revolutionary plugin that uses machine learning to generate responsive layouts from simple wireframes. Reduces design time by 60% while maintaining design system consistency.",
    "source": "Product Hunt",
    "contentType": "tool",
    "tags": ["figma-plugin", "layout-automation", "ai-tools", "design-systems"],
    "qualityScore": 0.89,
    "searchQuery": "Figma AI plugin automated layout generation 2026"
  }
]

IMPORTANT: Generate FRESH, VARIED content each time. Don't repeat the same articles/topics. Focus on current trends and practical value for UX designers.
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
          // Create search URLs optimized by content type
          const baseQuery = item.searchQuery || item.title;
          const domain = getSourceDomain(item.source);

          let searchUrl;
          switch (item.contentType) {
            case "tool":
              // For tools, search ProductHunt or the specific domain
              if (item.source === "Product Hunt") {
                searchUrl = `https://www.producthunt.com/search?q=${encodeURIComponent(baseQuery)}`;
              } else {
                searchUrl = `https://www.google.com/search?q=site:${domain} ${encodeURIComponent(baseQuery)}`;
              }
              break;

            case "video":
              // For videos, prioritize YouTube search
              if (domain.includes("youtube")) {
                searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(baseQuery + " UX design AI")}`;
              } else {
                searchUrl = `https://www.google.com/search?q=site:${domain} ${encodeURIComponent(baseQuery)} video`;
              }
              break;

            case "podcast":
              // For podcasts, use Google Podcasts or general search
              searchUrl = `https://www.google.com/search?q=${encodeURIComponent(baseQuery + " podcast UX AI design")}`;
              break;

            case "book":
              // For books, search on the publisher or general book search
              searchUrl = `https://www.google.com/search?q=site:${domain} ${encodeURIComponent(baseQuery)} book`;
              break;

            default: // article
              searchUrl = `https://www.google.com/search?q=site:${domain} ${encodeURIComponent(baseQuery)}`;
          }

          return {
            id: `gemini-${Date.now()}-${index}`,
            title: item.title,
            description: item.description,
            url: searchUrl,
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