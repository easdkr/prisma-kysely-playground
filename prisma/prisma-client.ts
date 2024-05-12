import { PrismaClient } from "@prisma/client";
import {
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from "kysely";
import kyselyExtension from "prisma-extension-kysely";
import type { DB } from "./generated/types";

export const prisma = new PrismaClient({
  log: ["query"],
}).$extends(
  kyselyExtension({
    kysely: (driver) =>
      new Kysely<DB>({
        dialect: {
          createDriver: () => driver,
          createAdapter: () => new PostgresAdapter(),
          createIntrospector: (db) => new PostgresIntrospector(db),
          createQueryCompiler: () => new PostgresQueryCompiler(),
        },
      }),
  })
);

export type PrismaService = typeof prisma;

export type PrismaTransactionManager = Parameters<
  Parameters<(typeof prisma)["$transaction"]>[0]
>[0];
