import { NextResponse } from "next/server";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  return NextResponse.json({
    databaseUrlExists: !!databaseUrl,
    databaseUrlPrefix: databaseUrl ? databaseUrl.substring(0, 20) + "..." : "Not set",
    isPostgresUrl: databaseUrl?.startsWith('postgres://') || false,
    hasSSL: databaseUrl?.includes('sslmode=require') || false,
    hostname: databaseUrl ? new URL(databaseUrl).hostname : "Not set",
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('DATABASE')),
  });
}