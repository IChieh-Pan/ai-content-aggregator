import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // Prisma 7 with PostgreSQL adapter
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  console.log("Creating Prisma client with:", connectionString.substring(0, 30) + "...");

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

// In production, always create fresh client to avoid caching old DATABASE_URL
export const prisma = process.env.NODE_ENV === "production"
  ? createPrismaClient()
  : (globalForPrisma.prisma ?? createPrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}