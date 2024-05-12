import type { PrismaService } from "../../prisma/prisma-client";
import type { PostLikeCommandRepository } from "./post-like.command-repository";
import type { PostCommandRepository } from "./post.command-repository";
import type { IPost, Post } from "./post.entity";
import type { PostQueryRepository } from "./post.query-repository";

export class PostService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly postQueryRepository: PostQueryRepository,
    private readonly postCommandRepository: PostCommandRepository,
    private readonly postLikeCommandRepository: PostLikeCommandRepository
  ) {}

  public async findRecentCreated(
    count: number,
    use: "prisma" | "kysely"
  ): Promise<Post[]> {
    return use === "prisma"
      ? await this.postQueryRepository.findRecentCreated(count)
      : await this.postQueryRepository.findRecentCreatedUsingBuilder(count);
  }

  public async createMany(posts: Omit<IPost, "id">[]): Promise<Post[]> {
    return await this.postCommandRepository.createMany(posts);
  }

  public async like(param: { userId: number; postId: number }): Promise<void> {
    return await this.prisma
      .$transaction(async (tx) => {
        const id = await this.postQueryRepository.findIdWithLock(
          param.postId,
          tx
        );

        if (id === null) {
          throw new Error("Post not found");
        }

        await this.postLikeCommandRepository.create(
          param.postId,
          param.userId,
          tx
        );
        await this.postCommandRepository.incrementLikes(id, tx);
      })
      .catch((e) => {
        console.error(e);
      });
  }
}
