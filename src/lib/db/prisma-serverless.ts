// Serverless-compatible version without native SQLite
// Uses sample data for deployment, easily upgradeable to real database later

import type { ContentItem, ContentType } from "@/lib/types";

// Sample data that matches our processed content structure
const sampleData: ContentItem[] = [
  {
    id: '1',
    title: 'How AI Is Transforming UX Research Methods',
    description: 'An in-depth look at how artificial intelligence tools are changing the way UX researchers collect and analyze user data.',
    url: 'https://www.nngroup.com/articles/ai-ux-research/',
    contentType: 'article',
    tags: ['AI', 'UX Research', 'User Testing', 'artificial-intelligence'],
    processorType: 'basic',
    qualityScore: 0.92,
    sourceId: 'nngroup',
    publishedAt: new Date('2024-03-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'AI in Design Systems: Practical Applications',
    description: 'Exploring how artificial intelligence can enhance design system creation, maintenance, and evolution.',
    url: 'https://www.smashingmagazine.com/2024/02/ai-design-systems-practical-guide/',
    contentType: 'article',
    tags: ['AI', 'Design Systems', 'Automation', 'design-systems'],
    processorType: 'basic',
    qualityScore: 0.88,
    sourceId: 'smashing-magazine',
    publishedAt: new Date('2024-02-28'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'The UX of AI: Designing Conversational Interfaces',
    description: 'Best practices for creating intuitive and helpful AI-powered conversational experiences.',
    url: 'https://uxdesign.cc/the-ux-of-ai-designing-conversational-interfaces-5f4e8c654321',
    contentType: 'article',
    tags: ['Conversational UI', 'AI', 'Chatbots', 'interaction-design'],
    processorType: 'basic',
    qualityScore: 0.91,
    sourceId: 'ux-collective',
    publishedAt: new Date('2024-03-10'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'AI Tools for UX Designers: 2024 Complete Guide',
    description: 'Comprehensive overview of AI-powered tools that are revolutionizing UX design workflows.',
    url: 'https://www.uxbooth.com/articles/ai-tools-ux-designers-2024-guide/',
    contentType: 'article',
    tags: ['AI Tools', 'Design Tools', 'Workflow', 'prototyping'],
    processorType: 'basic',
    qualityScore: 0.85,
    sourceId: 'ux-booth',
    publishedAt: new Date('2024-02-20'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    title: 'Figma AI Plugin: Auto-generate Design Variants',
    description: 'New Figma plugin uses machine learning to automatically generate design variations from your base components.',
    url: 'https://www.figma.com/community/plugin/ai-design-variants',
    contentType: 'tool',
    tags: ['Figma', 'Design Tools', 'Automation', 'AI'],
    processorType: 'basic',
    qualityScore: 0.78,
    sourceId: 'figma-community',
    publishedAt: new Date('2024-03-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    title: 'Ethics in AI Design: A UX Perspective',
    description: 'Exploring ethical considerations when designing AI-powered products and the UX designer\'s role in responsible AI.',
    url: 'https://alistapart.com/article/ethics-ai-design-ux-perspective/',
    contentType: 'article',
    tags: ['Ethics', 'AI', 'Responsible Design', 'design-thinking'],
    processorType: 'basic',
    qualityScore: 0.94,
    sourceId: 'a-list-apart',
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    title: 'Designing AI Products: From Concept to Launch',
    description: 'Complete guide to designing successful AI-powered products, covering research, prototyping, and testing methodologies.',
    url: 'https://www.oreilly.com/library/view/designing-ai-products/9781492097891/',
    contentType: 'book',
    tags: ['AI Products', 'Product Design', 'UX Strategy', 'design-thinking'],
    processorType: 'basic',
    qualityScore: 0.89,
    sourceId: 'oreilly',
    publishedAt: new Date('2024-01-30'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    title: 'UX and AI Podcast: Building Ethical AI Experiences',
    description: 'Discussion with leading UX researchers about creating AI experiences that are both powerful and ethical.',
    url: 'https://designbetter.co/podcast/ux-ai-ethical-experiences',
    contentType: 'podcast',
    tags: ['Ethics', 'AI', 'UX Research', 'Podcast'],
    processorType: 'basic',
    qualityScore: 0.87,
    sourceId: 'design-better',
    publishedAt: new Date('2024-02-10'),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Serverless-compatible database client
export const serverlessDb = {
  contentItem: {
    findMany: async ({ where, orderBy, skip, take }: any) => {
      let filtered = [...sampleData];

      // Apply search filtering
      if (where?.OR) {
        const query = where.OR[0]?.title?.contains || '';
        if (query) {
          filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
          );
        }
      }

      // Apply content type filtering
      if (where?.contentType?.in) {
        filtered = filtered.filter(item => where.contentType.in.includes(item.contentType));
      }

      // Apply date filtering
      if (where?.publishedAt?.gte) {
        filtered = filtered.filter(item => new Date(item.publishedAt) >= where.publishedAt.gte);
      }

      // Sort by published date (newest first)
      filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      // Apply pagination
      if (skip) filtered = filtered.slice(skip);
      if (take) filtered = filtered.slice(0, take);

      return filtered;
    },

    count: async ({ where }: any) => {
      // Same filtering logic as above for count
      let filtered = [...sampleData];
      if (where?.OR) {
        const query = where.OR[0]?.title?.contains || '';
        if (query) {
          filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
          );
        }
      }
      return filtered.length;
    }
  },

  contentSource: {
    findMany: async ({ where }: any) => {
      return [
        { id: '1', name: 'UX Collective', url: 'https://uxdesign.cc/feed', isActive: true },
        { id: '2', name: 'Smashing Magazine', url: 'https://smashingmagazine.com/feed', isActive: true },
      ];
    }
  }
};