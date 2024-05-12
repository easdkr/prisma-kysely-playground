import {
  prisma,
  type PrismaTransactionManager,
} from "../../prisma/prisma-client";
import { Post, type IPost } from "./post.entity";

export class PostCommandRepository {
  public async createMany(posts: Omit<IPost, "id">[]): Promise<Post[]> {
    const ids = await prisma.$kysely
      .insertInto("posts")
      .values(
        posts.map((p) => ({
          author_id: p.author.id,
          title: p.title,
          created_at: p.createdAt,
          updated_at: p.updatedAt,
        }))
      )
      .returning("id")
      .execute()
      .then((rows) => rows.map((row) => row.id));

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
      .where("p.id", "in", ids)
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

  public async incrementLikes(
    postId: number,
    tx: PrismaTransactionManager
  ): Promise<void> {
    await tx.post.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });
  }
}
