import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
  schema: path.join(__dirname, "prisma", "schema.prisma"),
});
