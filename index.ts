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
  const createdPost = await postService.createMany([
    {
      title: "Hi there!",
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Hello World!",
      authorId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log(
    "created-post",
    createdPost.map((post) => post.toString())
  );

  // 최근 생성된 게시물 조회
  const recentPosts = await postService.findRecentCreated(2, "kysely");
  console.log(
    "recentPost",
    recentPosts.map((post) => post.toString())
  );

  // 게시물 좋아요 (성공 1, 실패 1)
  await Promise.all([
    postService.like({ userId: 1, postId: recentPosts[0].id }),
    postService.like({ userId: -1, postId: recentPosts[0].id }),
  ]);

  // 확인
  await prisma.post
    .findFirst({
      where: { id: recentPosts[0].id },
    })
    .then((post) => {
      console.log(post);
    });
}

await bootstrap().finally(async () => {
  await prisma.$disconnect();
});
