import type { PrismaTransactionManager } from "../../prisma/prisma-client";

export class PostLikeCommandRepository {
  public async create(
    postId: number,
    userId: number,
    tx: PrismaTransactionManager
  ): Promise<void> {
    await tx.postLikes.create({
      data: {
        postId,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}
