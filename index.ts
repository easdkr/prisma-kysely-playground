import { prisma } from "./prisma/prisma-client";
import {
  PostCommandRepository,
  PostLikeCommandRepository,
  PostQueryRepository,
  PostService,
} from "./apps/post";

async function bootstrap() {
  await prisma.$connect();

  const postService = new PostService(
    prisma,
    new PostQueryRepository(),
    new PostCommandRepository(),
    new PostLikeCommandRepository()
  );

  // 게시물 생성
  const posts = await postService.findRecentCreated(5, "prisma");
  console.log(posts.map((post) => post.toString()));

  // 게시물 좋아요 (성공 1, 실패 1)
  await Promise.all([
    postService.like({ userId: 1, postId: 1 }),
    postService.like({ userId: -1, postId: 100 }),
  ]);

  // 확인
  await prisma.post
    .findFirst({
      where: { id: 1 },
    })
    .then((post) => {
      console.log(post);
    });
}

await bootstrap().finally(async () => {
  await prisma.$disconnect();
});
