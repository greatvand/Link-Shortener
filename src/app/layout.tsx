import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { HeaderAuth } from "@/components/header-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Link Shortener — Shorten your links, not your reach",
  description:
    "Create short, memorable URLs that are easy to share. Track clicks, customize slugs, and grow your reach with our fast and secure link shortener.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ClerkProvider>
            <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b bg-background px-6 py-3">
              <Button asChild variant="link" size="sm" className="text-lg font-semibold tracking-tight">
                <Link href="/">Link Shortener</Link>
              </Button>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <HeaderAuth />
              </div>
            </header>
            {children}
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
