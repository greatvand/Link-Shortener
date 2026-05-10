"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import crypto from "crypto";

import db from "@/index";
import { links } from "@/db/schema";

// ── Helpers ──────────────────────────────────────────────

function generateSlug(length = 7): string {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
}

const RESERVED_SLUGS = new Set([
  "dashboard",
  "api",
  "sign-in",
  "sign-up",
  "favicon",
  "_next",
  "admin",
  "login",
  "logout",
  "register",
]);

function validateSlug(slug: string): void {
  if (slug.length < 3) throw new Error("Slug must be at least 3 characters");
  if (slug.length > 32) throw new Error("Slug must be at most 32 characters");
  if (!/^[a-zA-Z0-9_-]+$/.test(slug))
    throw new Error("Slug may only contain letters, numbers, hyphens, and underscores");
  if (RESERVED_SLUGS.has(slug.toLowerCase()))
    throw new Error("This slug is reserved — please choose another");
}

async function getUniqueSlug(): Promise<string> {
  let slug = generateSlug();
  let existing = await db
    .select({ id: links.id })
    .from(links)
    .where(eq(links.slug, slug))
    .limit(1);
  while (existing.length > 0) {
    slug = generateSlug();
    existing = await db
      .select({ id: links.id })
      .from(links)
      .where(eq(links.slug, slug))
      .limit(1);
  }
  return slug;
}

// ── Create ────────────────────────────────────────────────

export async function createLink(_prev: unknown, formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "You must be signed in to create links" };

  const originalUrl = (formData.get("originalUrl") as string)?.trim();
  const customSlug = (formData.get("slug") as string)?.trim() || null;

  if (!originalUrl) return { error: "URL is required" };

  let parsed: URL;
  try {
    parsed = new URL(originalUrl);
    if (!["http:", "https:"].includes(parsed.protocol))
      return { error: "URL must start with http:// or https://" };
  } catch {
    return { error: "Please enter a valid URL (e.g. https://example.com)" };
  }

  let slug: string;
  if (customSlug) {
    try {
      validateSlug(customSlug);
    } catch (e) {
      return { error: (e as Error).message };
    }
    const existing = await db
      .select({ id: links.id })
      .from(links)
      .where(eq(links.slug, customSlug))
      .limit(1);
    if (existing.length > 0) return { error: "This slug is already taken" };
    slug = customSlug;
  } else {
    slug = await getUniqueSlug();
  }

  await db.insert(links).values({
    originalUrl: parsed.href,
    slug,
    userId,
  });

  revalidatePath("/dashboard");
  return { success: true, slug };
}

// ── Update ────────────────────────────────────────────────

export async function updateLink(_prev: unknown, formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "You must be signed in" };

  const linkId = (formData.get("linkId") as string)?.trim();
  const originalUrl = (formData.get("originalUrl") as string)?.trim();
  const newSlug = (formData.get("slug") as string)?.trim() || null;
  const isActiveRaw = formData.get("isActive");

  if (!linkId) return { error: "Link ID is required" };

  // Verify ownership
  const [link] = await db
    .select()
    .from(links)
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .limit(1);

  if (!link) return { error: "Link not found" };

  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (originalUrl) {
    try {
      const parsed = new URL(originalUrl);
      if (!["http:", "https:"].includes(parsed.protocol))
        return { error: "URL must start with http:// or https://" };
      updates.originalUrl = parsed.href;
    } catch {
      return { error: "Please enter a valid URL" };
    }
  }

  if (newSlug && newSlug !== link.slug) {
    try {
      validateSlug(newSlug);
    } catch (e) {
      return { error: (e as Error).message };
    }
    const existing = await db
      .select({ id: links.id })
      .from(links)
      .where(eq(links.slug, newSlug))
      .limit(1);
    if (existing.length > 0) return { error: "This slug is already taken" };
    updates.slug = newSlug;
  }

  if (isActiveRaw !== null && isActiveRaw !== undefined) {
    updates.isActive = isActiveRaw === "true";
  }

  if (Object.keys(updates).length > 1) {
    await db.update(links).set(updates).where(eq(links.id, linkId));
  }

  revalidatePath("/dashboard");
  return { success: true };
}

// ── Delete ────────────────────────────────────────────────

export async function deleteLink(_prev: unknown, formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: "You must be signed in" };

  const linkId = (formData.get("linkId") as string)?.trim();
  if (!linkId) return { error: "Link ID is required" };

  const [link] = await db
    .select()
    .from(links)
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .limit(1);

  if (!link) return { error: "Link not found" };

  await db.delete(links).where(eq(links.id, linkId));

  revalidatePath("/dashboard");
  return { success: true };
}
