export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: string;
}

export const DEFAULT_FEED_SOURCES: FeedSource[] = [
  {
    id: "a-list-apart",
    name: "A List Apart",
    url: "https://alistapart.com/main/feed/",
    category: "web-design",
  },
  {
    id: "ux-planet",
    name: "UX Planet",
    url: "https://uxplanet.org/feed",
    category: "ux-design",
  },
  {
    id: "smashing-magazine",
    name: "Smashing Magazine",
    url: "https://www.smashingmagazine.com/feed/",
    category: "web-design",
  },
  {
    id: "nielsen-norman",
    name: "Nielsen Norman Group",
    url: "https://www.nngroup.com/feed/rss/",
    category: "ux-research",
  },
  {
    id: "ux-collective",
    name: "UX Collective",
    url: "https://uxdesign.cc/feed",
    category: "ux-design",
  },
  {
    id: "css-tricks",
    name: "CSS-Tricks",
    url: "https://css-tricks.com/feed/",
    category: "frontend",
  },
  {
    id: "baymard-institute",
    name: "Baymard Institute",
    url: "https://baymard.com/blog.atom",
    category: "ux-research",
  },
  {
    id: "ux-booth",
    name: "UX Booth",
    url: "https://www.uxbooth.com/feed/",
    category: "ux-design",
  },
];
