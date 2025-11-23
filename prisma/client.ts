import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./generated/client.ts";
export function getPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3(
      {
        url: "file:./prisma/dev.db",
      },
      {
        timestampFormat: "unixepoch-ms",
      },
    ),
  });
}
