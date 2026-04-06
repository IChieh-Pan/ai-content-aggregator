import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import type { ContentType } from "@/lib/types";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "12", 10);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const types = searchParams
    .get("types")
    ?.split(",")
    .filter(Boolean) as ContentType[] | undefined;
  const days = searchParams.get("days");

  const where: Prisma.ContentItemWhereInput = {};

  if (query) {
    where.OR = [
      { title: { contains: query } },
      { description: { contains: query } },
      { tags: { contains: query } },
    ];
  }

  if (types && types.length > 0) {
    where.contentType = { in: types };
  }

  if (days) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - parseInt(days, 10));
    where.publishedAt = { gte: cutoff };
  }

  const [items, total] = await Promise.all([
    prisma.contentItem.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contentItem.count({ where }),
  ]);

  // Parse tags JSON string back to array for the frontend
  const serializedItems = items.map((item) => ({
    ...item,
    tags: JSON.parse(item.tags) as string[],
  }));

  return NextResponse.json({
    items: serializedItems,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  });
}
