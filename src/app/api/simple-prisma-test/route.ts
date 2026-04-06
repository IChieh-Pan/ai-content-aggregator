import { NextResponse } from "next/server";

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json({
        status: "ERROR",
        error: "DATABASE_URL not found in environment"
      });
    }

    // Try creating a simple PrismaClient with direct URL
    const { PrismaClient } = await import("@prisma/client");

    const prisma = new PrismaClient({
      datasourceUrl: databaseUrl,
      log: ["error", "warn"]
    });

    try {
      // Try a simple query
      const result = await prisma.$queryRaw`SELECT 1 as test, current_database() as db_name`;

      await prisma.$disconnect();

      return NextResponse.json({
        status: "SUCCESS",
        message: "Simple Prisma connection successful",
        result,
        databaseUrlHost: databaseUrl.includes('db.prisma.io') ? 'db.prisma.io' : 'other'
      });

    } catch (prismaError) {
      await prisma.$disconnect();

      return NextResponse.json({
        status: "PRISMA_ERROR",
        error: prismaError instanceof Error ? prismaError.message : String(prismaError),
        databaseUrlExists: true,
        databaseUrlHost: databaseUrl.includes('db.prisma.io') ? 'db.prisma.io' : 'other'
      }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({
      status: "GENERAL_ERROR",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}