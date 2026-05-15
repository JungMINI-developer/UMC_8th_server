import "dotenv/config";
import { TagName } from "../src/types/tag";
import { prisma } from "../src/db.prisma";

const seedTags = async () => {
  const tags = Object.values(TagName) as TagName[];

  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { tagName },
      create: { tagName },
      update: {},
    });
  }

  console.log(`Seeded ${tags.length} tags: ${tags.join(", ")}`);
};

seedTags()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
