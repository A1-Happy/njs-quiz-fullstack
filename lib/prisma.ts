import { PrismaClient } from "@prisma/client";

const gt = globalThis as typeof globalThis & { prisma?: PrismaClient };
const prisma = gt.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") gt.prisma = prisma;

export { prisma };
