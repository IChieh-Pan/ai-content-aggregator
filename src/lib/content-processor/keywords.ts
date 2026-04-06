const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "it", "as", "be", "was", "are",
  "been", "being", "have", "has", "had", "do", "does", "did", "will",
  "would", "could", "should", "may", "might", "can", "this", "that",
  "these", "those", "i", "you", "he", "she", "we", "they", "what",
  "which", "who", "when", "where", "why", "how", "all", "each", "every",
  "both", "few", "more", "most", "other", "some", "such", "no", "not",
  "only", "own", "same", "so", "than", "too", "very", "just", "about",
  "above", "after", "again", "also", "am", "any", "because", "before",
  "between", "during", "here", "into", "its", "me", "my", "our", "out",
  "over", "then", "there", "their", "them", "through", "under", "up",
  "us", "your", "new", "one", "two", "now", "way", "like", "get",
  "make", "made", "know", "take", "come", "think", "see", "look",
  "want", "give", "use", "find", "tell", "ask", "work", "seem",
  "feel", "try", "leave", "call", "need", "become", "keep", "let",
  "begin", "show", "hear", "play", "run", "move", "live", "believe",
]);

const UX_DOMAIN_TERMS: Record<string, number> = {
  "user experience": 3, "ux": 3, "ui": 3, "user interface": 3,
  "usability": 3, "accessibility": 3, "a11y": 3, "wcag": 3,
  "design system": 3, "component library": 2, "design tokens": 2,
  "user research": 3, "user testing": 3, "usability testing": 3,
  "heuristic evaluation": 2, "cognitive walkthrough": 2,
  "information architecture": 3, "ia": 2, "navigation": 2, "sitemap": 2,
  "wireframe": 2, "prototype": 2, "mockup": 2, "figma": 2, "sketch": 2,
  "interaction design": 3, "ixd": 2, "microinteraction": 2,
  "responsive design": 2, "mobile first": 2, "adaptive": 2,
  "typography": 2, "color theory": 2, "visual hierarchy": 2, "layout": 2,
  "persona": 2, "user journey": 2, "journey map": 2, "empathy map": 2,
  "card sorting": 2, "tree testing": 2, "a/b testing": 2,
  "design thinking": 2, "human centered": 2, "hcd": 2,
  "atomic design": 2, "material design": 2, "fluent design": 2,
  "gestalt": 2, "affordance": 2, "mental model": 2,
};

export function extractKeywords(
  text: string,
  maxKeywords: number = 10,
  customStopWords: string[] = [],
): string[] {
  const allStopWords = new Set([...STOP_WORDS, ...customStopWords]);
  const lowerText = text.toLowerCase();

  // Score domain-specific multi-word terms first
  const domainMatches: { term: string; score: number }[] = [];
  for (const [term, weight] of Object.entries(UX_DOMAIN_TERMS)) {
    const regex = new RegExp(`\\b${escapeRegex(term)}\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches) {
      domainMatches.push({ term, score: matches.length * weight });
    }
  }

  // Tokenize and count single words
  const words = lowerText
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !allStopWords.has(w));

  const wordFreq = new Map<string, number>();
  for (const word of words) {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  }

  // Combine domain terms and single-word frequencies
  const scored = new Map<string, number>();

  for (const { term, score } of domainMatches) {
    scored.set(term, (scored.get(term) || 0) + score);
  }

  for (const [word, freq] of wordFreq) {
    if (!scored.has(word)) {
      scored.set(word, freq);
    }
  }

  return Array.from(scored.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([term]) => term);
}

export function generateTags(keywords: string[]): string[] {
  const tagMap: Record<string, string[]> = {
    "ux-research": ["user research", "user testing", "usability testing", "persona", "user journey", "journey map", "empathy map", "card sorting", "tree testing", "heuristic evaluation", "cognitive walkthrough"],
    "ui-design": ["ui", "user interface", "visual hierarchy", "layout", "typography", "color theory"],
    "interaction-design": ["interaction design", "ixd", "microinteraction", "prototype", "animation"],
    "accessibility": ["accessibility", "a11y", "wcag", "aria", "screen reader"],
    "design-systems": ["design system", "component library", "design tokens", "atomic design", "material design", "fluent design"],
    "user-testing": ["a/b testing", "usability testing", "user testing", "analytics", "heatmap"],
    "information-architecture": ["information architecture", "ia", "navigation", "sitemap", "taxonomy"],
    "visual-design": ["typography", "color theory", "visual hierarchy", "layout", "grid", "spacing"],
    "prototyping": ["wireframe", "prototype", "mockup", "figma", "sketch"],
    "design-thinking": ["design thinking", "human centered", "hcd", "ideation", "brainstorm"],
  };

  const tags = new Set<string>();
  const lowerKeywords = keywords.map((k) => k.toLowerCase());

  for (const [tag, terms] of Object.entries(tagMap)) {
    for (const term of terms) {
      if (lowerKeywords.some((k) => k.includes(term) || term.includes(k))) {
        tags.add(tag);
        break;
      }
    }
  }

  return Array.from(tags);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
