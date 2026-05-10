import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

const db = drizzle(process.env.DATABASE_URL!, { schema });

const USER_ID = "user_3DJDN20e5kuE9lu1WyS5dIJA4yP";

const dummyLinks = [
  { slug: "nextjs-docs", url: "https://nextjs.org/docs/getting-started" },
  { slug: "tailwind-v4", url: "https://tailwindcss.com/docs/installation/vite" },
  { slug: "clerk-auth", url: "https://clerk.com/docs/quickstarts/nextjs" },
  { slug: "neon-serverless", url: "https://neon.tech/docs/introduction" },
  { slug: "drizzle-orm", url: "https://orm.drizzle.team/docs/overview" },
  { slug: "react-19", url: "https://react.dev/blog/2024/12/05/react-19" },
  { slug: "shadcn-ui", url: "https://ui.shadcn.com/docs" },
  { slug: "typescript", url: "https://www.typescriptlang.org/docs/" },
  { slug: "lucide-icons", url: "https://lucide.dev/icons/" },
  { slug: "vscode", url: "https://code.visualstudio.com/docs" },
];

async function seed() {
  console.log(`Seeding ${dummyLinks.length} links for user ${USER_ID}...\n`);

  for (const { slug, url } of dummyLinks) {
    await db.insert(schema.links).values({
      slug,
      originalUrl: url,
      userId: USER_ID,
    });
    console.log(`  ✓ ${slug} → ${url}`);
  }

  console.log(`\nDone — ${dummyLinks.length} links inserted.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
