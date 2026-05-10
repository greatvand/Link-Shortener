import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

import db from "@/index";
import { links } from "@/db/schema";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function SlugRedirectPage({ params }: Props) {
  const { slug } = await params;

  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.slug, slug))
    .limit(1);

  if (!link || !link.isActive) {
    notFound();
  }

  // Increment click counter (fire-and-forget — redirect takes priority)
  await db
    .update(links)
    .set({ clicks: link.clicks + 1 })
    .where(eq(links.id, link.id));

  redirect(link.originalUrl);
}
