import { NextResponse } from "next/server";

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json({
        status: "ERROR",
        error: "DATABASE_URL not found"
      }, { status: 500 });
    }

    // Parse the URL to see what we're getting
    const url = new URL(databaseUrl);

    // Try direct pg connection without Prisma
    const { Pool } = await import("pg");

    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    try {
      const result = await pool.query('SELECT 1 as test');
      await pool.end();

      return NextResponse.json({
        status: "SUCCESS",
        message: "Direct PostgreSQL connection successful",
        hostname: url.hostname,
        port: url.port,
        database: url.pathname,
        testResult: result.rows[0]
      });

    } catch (pgError) {
      await pool.end();
      return NextResponse.json({
        status: "PG_ERROR",
        error: pgError instanceof Error ? pgError.message : String(pgError),
        hostname: url.hostname,
        port: url.port,
        parsedUrl: {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port,
          pathname: url.pathname
        }
      }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({
      status: "PARSE_ERROR",
      error: error instanceof Error ? error.message : String(error),
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + "..."
    }, { status: 500 });
  }
}