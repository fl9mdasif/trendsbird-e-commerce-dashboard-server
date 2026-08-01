import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import config from "../config";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const createPrismaInstance = () => {
  const pool = new Pool({
    connectionString: config.database_url,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || createPrismaInstance();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma; 