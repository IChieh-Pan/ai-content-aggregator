import { NextRequest, NextResponse } from "next/server";
import { serverlessDb } from "@/lib/db/prisma-serverless";

export async function GET() {
  const sources = await serverlessDb.contentSource.findMany({});
  return NextResponse.json(sources);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, url } = body;

    if (!name || !type || !url) {
      return NextResponse.json(
        { error: "name, type, and url are required" },
        { status: 400 },
      );
    }

    // Serverless version - would need real database for persistence
    const source = {
      id: Date.now().toString(),
      name,
      type,
      url,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      ...source,
      message: "Connect to Vercel Postgres or Turso for persistent storage"
    }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create source";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
