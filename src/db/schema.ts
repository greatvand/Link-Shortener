import { pgTable, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

/**
 * Links table — stores every shortened URL.
 *
 * - slug:      unique short code used for redirects
 * - user_id:   Clerk user who owns the link (no FK — Clerk-managed)
 * - clicks:    simple click counter, incremented on each redirect
 * - is_active: soft-delete flag; set to false to disable a link
 */
export const links = pgTable(
  "links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    originalUrl: text("original_url").notNull(),
    userId: text("user_id").notNull(),
    clicks: integer("clicks").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Fast lookups for a user's links (dashboard queries)
    index("idx_links_user_id").on(table.userId),
  ]
);
