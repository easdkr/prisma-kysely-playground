import {
  prisma,
  type PrismaTransactionManager,
} from "../../prisma/prisma-client";
import { Post } from "./post.entity";

export class PostQueryRepository {
  public async findIdWithLock(
    id: number,
    tx: PrismaTransactionManager
  ): Promise<number | null> {
    return await tx.$kysely
      .selectFrom("posts as p")
      .select("p.id")
      .where("p.id", "=", id)
      .forUpdate()
      .execute()
      .then((rows) => {
        return rows.length > 0 ? rows[0].id : null;
      });
  }

  public async findRecentCreated(count = 20): Promise<Post[]> {
    return await prisma.post
      .findMany({
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: count,
      })
      .then((posts) =>
        posts.map((post) =>
          Post.of({
            id: post.id,
            title: post.title,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            author: {
              id: post.author.id,
              name: post.author.name,
            },
          })
        )
      );
  }

  public async findRecentCreatedUsingBuilder(count = 20): Promise<Post[]> {
    return await prisma.$kysely
      .selectFrom("posts as p")
      .innerJoin("users as u", "p.author_id", "u.id")
      .select([
        "p.id as id",
        "p.title as title",
        "p.created_at as createdAt",
        "p.updated_at as updatedAt",
        "u.id as authorId",
        "u.name as authorName",
      ])
      .orderBy("p.id", "desc")
      .limit(count)
      .execute()
      .then((rows) =>
        rows.map((row) =>
          Post.of({
            id: row.id,
            title: row.title,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            author: {
              id: row.authorId,
              name: row.authorName,
            },
          })
        )
      );
  }
}
