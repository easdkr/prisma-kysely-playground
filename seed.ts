import { prisma } from "./prisma/prisma-client";

async function seed() {
  await prisma.$connect();
  const bulkSize = 100;

  await prisma.user.createMany({
    data: new Array(bulkSize).fill(0).map((_, index) => ({
      name: `User ${index + 1}`,
    })),
  });

  await prisma.$disconnect();
}

await seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
