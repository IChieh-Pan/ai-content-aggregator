import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const sources = await prisma.contentSource.findMany({
    orderBy: { name: "asc" },
  });
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

    const source = await prisma.contentSource.create({
      data: { name, type, url },
    });

    return NextResponse.json(source, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create source";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
