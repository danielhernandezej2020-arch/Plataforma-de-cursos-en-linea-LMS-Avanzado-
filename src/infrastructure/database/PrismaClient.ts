import { PrismaClient as BasePrismaClient } from "@/lib/prisma";

export class DatabaseClient {
  private static instance: DatabaseClient | null = null;
  private client: BasePrismaClient;

  private constructor() {
    this.client = new BasePrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query"] : [],
    });
  }

  public static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  public getClient(): BasePrismaClient {
    return this.client;
  }

  public async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }
}

// Prevent multiple instances during Next.js hot reload
const globalForPrisma = globalThis as unknown as {
  databaseClient: DatabaseClient | undefined;
};

export const db =
  globalForPrisma.databaseClient ?? DatabaseClient.getInstance();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.databaseClient = db;
}
