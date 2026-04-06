// Real RSS sources for UX and AI content
export const RSS_SOURCES = [
  // UX Design Sources
  {
    name: "Nielsen Norman Group",
    url: "https://www.nngroup.com/feed/",
    type: "rss",
    contentType: "article"
  },
  {
    name: "UX Collective",
    url: "https://uxdesign.cc/feed",
    type: "rss",
    contentType: "article"
  },
  {
    name: "UX Planet",
    url: "https://uxplanet.org/feed",
    type: "rss",
    contentType: "article"
  },
  {
    name: "A List Apart",
    url: "https://alistapart.com/main/feed/",
    type: "rss",
    contentType: "article"
  },
  {
    name: "UX Mastery",
    url: "https://uxmastery.com/feed/",
    type: "rss",
    contentType: "article"
  },

  // AI/Tech Sources with UX Focus
  {
    name: "UX Pin (Medium)",
    url: "https://medium.com/feed/@uxpin",
    type: "rss",
    contentType: "article"
  },
  {
    name: "The UX Blog - UXPin",
    url: "https://www.uxpin.com/studio/blog/feed/",
    type: "rss",
    contentType: "article"
  },
  {
    name: "Smashing Magazine UX",
    url: "https://www.smashingmagazine.com/feed/",
    type: "rss",
    contentType: "article"
  },
  {
    name: "Designer Hangout",
    url: "https://designerhangout.co/feed/",
    type: "rss",
    contentType: "article"
  },

  // AI/ML Sources
  {
    name: "Towards Data Science (AI/UX)",
    url: "https://towardsdatascience.com/feed/tagged/artificial-intelligence",
    type: "rss",
    contentType: "article"
  },

  // Design + Tech Podcasts
  {
    name: "Design Better Podcast",
    url: "https://feeds.simplecast.com/6WD42dbw",
    type: "rss",
    contentType: "podcast"
  },
  {
    name: "Design Details",
    url: "https://feeds.simplecast.com/W7YKLQTB",
    type: "rss",
    contentType: "podcast"
  }
] as const;

// Keywords to identify AI+UX relevant content
export const AI_UX_KEYWORDS = [
  // AI/ML terms
  "artificial intelligence",
  "machine learning",
  "AI",
  "ML",
  "automation",
  "algorithm",
  "chatbot",
  "voice interface",
  "conversational ui",
  "personalization",
  "recommendation",
  "natural language",
  "computer vision",

  // UX + AI intersection terms
  "ai ux",
  "ux ai",
  "human-centered ai",
  "ethical ai",
  "ai ethics",
  "explainable ai",
  "ai transparency",
  "algorithmic bias",
  "ai accessibility",
  "intelligent interfaces",
  "adaptive interfaces",
  "smart defaults",
  "predictive ux",
  "ai-powered",
  "ai-driven",

  // Design process + AI
  "design automation",
  "generative design",
  "ai design tools",
  "design systems ai",
  "automated testing",
  "ai research",
  "user behavior prediction"
] as const;