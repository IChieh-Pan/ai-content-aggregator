import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test database connection without importing prisma client yet
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json({
        status: "ERROR",
        error: "DATABASE_URL environment variable is missing"
      }, { status: 500 });
    }

    // Try to import and test prisma client
    try {
      const { prisma } = await import("@/lib/db/prisma");

      // Simple query to test connection
      await prisma.$queryRaw`SELECT 1 as test`;

      return NextResponse.json({
        status: "SUCCESS",
        message: "Database connection successful",
        databaseUrl: databaseUrl.substring(0, 30) + "..." // Don't expose full URL
      });

    } catch (prismaError) {
      return NextResponse.json({
        status: "PRISMA_ERROR",
        error: prismaError instanceof Error ? prismaError.message : String(prismaError),
        databaseUrl: databaseUrl ? "Present" : "Missing"
      }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({
      status: "GENERAL_ERROR",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}