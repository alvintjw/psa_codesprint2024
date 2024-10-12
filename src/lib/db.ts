import { PrismaClient } from "@prisma/client";
import "server-only";

declare global {
  // Avoids using var when TypeScript is used
  // `global` is used to store the Prisma client to avoid creating multiple instances in development
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}
