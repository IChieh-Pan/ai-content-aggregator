// Serverless-compatible version without native SQLite
// Uses sample data for deployment, easily upgradeable to real database later

import type { ContentItem, ContentType } from "@/lib/types";

// Sample data that matches our processed content structure
const sampleData: ContentItem[] = [
  {
    id: '1',
    title: 'How AI Is Transforming UX Research Methods',
    description: 'An in-depth look at how artificial intelligence tools are changing the way UX researchers collect and analyze user data.',
    url: 'https://example.com/ai-ux-research',
    contentType: 'article',
    tags: ['AI', 'UX Research', 'User Testing', 'artificial-intelligence'],
    processorType: 'basic',
    qualityScore: 0.92,
    sourceId: 'ux-collective',
    publishedAt: new Date('2026-04-05'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Designing with AI: A Practical Guide for UX Designers',
    description: 'This comprehensive guide covers the fundamentals of integrating AI capabilities into your design workflow.',
    url: 'https://example.com/designing-with-ai',
    contentType: 'book',
    tags: ['AI', 'Design Systems', 'Workflow', 'design-systems'],
    processorType: 'basic',
    qualityScore: 0.88,
    sourceId: 'smashing-magazine',
    publishedAt: new Date('2026-04-03'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add more sample data...
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