import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL ? {
      exists: true,
      host: process.env.DATABASE_URL.split('@')[1]?.split(':')[0] || 'unknown',
      length: process.env.DATABASE_URL.length,
    } : {
      exists: false
    },
    NODE_ENV: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}