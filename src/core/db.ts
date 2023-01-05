import { PrismaClient } from "@prisma/client";

declare global {
  var db: PrismaClient | undefined;
}

const db = new PrismaClient();

export default db;
