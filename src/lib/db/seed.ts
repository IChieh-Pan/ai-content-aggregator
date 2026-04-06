import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const defaultSources = [
  {
    name: "Nielsen Norman Group",
    type: "rss",
    url: "https://www.nngroup.com/feed/rss/",
  },
  {
    name: "Smashing Magazine UX",
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
  console.log("Seeding database...");

  for (const source of defaultSources) {
    await prisma.contentSource.upsert({
      where: { url: source.url },
      update: {},
      create: source,
    });
  }
  console.log(`Seeded ${defaultSources.length} content sources`);

  await prisma.contentProcessor.upsert({
    where: { name: defaultProcessor.name },
    update: {},
    create: defaultProcessor,
  });
  console.log("Seeded default processor");

  console.log("Database seeding complete.");
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
