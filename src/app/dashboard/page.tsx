import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Calendar, ExternalLink, Link2, MousePointerClick } from "lucide-react";

import db from "@/index";
import { links } from "@/db/schema";
import { CopyButton } from "@/components/copy-button";
import { CreateLinkDialog } from "@/components/create-link-dialog";
import { LinkRowActions } from "@/components/link-row-actions";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const { userId } = await auth();

  const userLinks = userId
    ? await db
        .select()
        .from(links)
        .where(eq(links.userId, userId))
        .orderBy(desc(links.createdAt))
    : [];

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol =
    headersList.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");

  return (
    <div className="flex flex-1 flex-col gap-8 px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back. Manage your shortened links below.
          </p>
        </div>
        {userLinks.length > 0 && <CreateLinkDialog />}
      </div>

      {userLinks.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed p-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <Link2 className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No links yet. Create your first short link to get started.
            </p>
            <CreateLinkDialog />
          </div>
        </div>
      ) : (
        <ul className="grid gap-3">
          {userLinks.map((link) => {
            const shortUrl = `${protocol}://${host}/${link.slug}`;

            return (
              <li key={link.id}>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <CardTitle className="truncate text-sm font-medium">
                            {link.originalUrl}
                          </CardTitle>
                          <a
                            href={link.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-muted-foreground hover:text-foreground"
                            aria-label="Open original URL"
                          >
                            <ExternalLink className="size-3.5" />
                          </a>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <Link2 className="size-3 shrink-0" />
                          <code className="truncate text-xs font-medium text-primary">
                            {shortUrl}
                          </code>
                          <CopyButton text={shortUrl} />
                        </CardDescription>
                      </div>

                      <div className="flex shrink-0 items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MousePointerClick className="size-3" />
                          {link.clicks}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(link.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                        {!link.isActive && (
                          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                            Inactive
                          </span>
                        )}
                        <LinkRowActions
                          link={{
                            id: link.id,
                            slug: link.slug,
                            originalUrl: link.originalUrl,
                            isActive: link.isActive,
                          }}
                        />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}