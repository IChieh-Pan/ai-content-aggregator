import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultSources = [
  {
    name: "Nielsen Norman Group",
    type: "rss",
    url: "https://www.nngroup.com/feed/rss/",
  },
  {
    name: "Smashing Magazine",
    type: "rss",
    url: "https://www.smashingmagazine.com/feed/",
  },
  {
    name: "A List Apart",
    type: "rss",
    url: "https://alistapart.com/main/feed/",
  },
  {
    name: "UX Collective",
    type: "rss",
    url: "https://uxdesign.cc/feed",
  },
  {
    name: "CSS-Tricks",
    type: "rss",
    url: "https://css-tricks.com/feed/",
  },
  {
    name: "UX Planet",
    type: "rss",
    url: "https://uxplanet.org/feed",
  },
  {
    name: "Baymard Institute",
    type: "rss",
    url: "https://baymard.com/blog.atom",
  },
  {
    name: "UX Booth",
    type: "rss",
    url: "https://www.uxbooth.com/feed/",
  },
];

const defaultProcessor = {
  name: "basic",
  type: "basic",
  config: JSON.stringify({
    maxKeywords: 10,
    minRelevanceScore: 0.3,
  }),
  isActive: true,
};

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create content sources
    for (const source of defaultSources) {
      await prisma.contentSource.upsert({
        where: { url: source.url },
        update: {},
        create: source,
      });
    }
    console.log(`✅ Seeded ${defaultSources.length} content sources`);

    // Create default processor
    await prisma.contentProcessor.upsert({
      where: { name: defaultProcessor.name },
      update: {},
      create: defaultProcessor,
    });
    console.log("✅ Seeded default processor");

    console.log("🎉 Database seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());