import { LandingCTA } from "@/components/landing-cta";
import {
  Zap,
  PenLine,
  BarChart3,
  Shield,
  UserPlus,
  Link2,
  Share2,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Create short links in an instant. Our optimized engine delivers redirects with minimal latency.",
  },
  {
    icon: PenLine,
    title: "Custom Slugs",
    description:
      "Make your links memorable and on-brand with custom aliases that reflect your content.",
  },
  {
    icon: BarChart3,
    title: "Link Analytics",
    description:
      "Track every click with detailed analytics. Understand your audience and measure engagement.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Built on modern infrastructure with enterprise-grade security. Your links stay safe and always online.",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "Create an account",
    description: "Sign up in seconds with email or social login.",
  },
  {
    icon: Link2,
    title: "Paste your long URL",
    description: "Enter any URL and customize your short link slug.",
  },
  {
    icon: Share2,
    title: "Share anywhere",
    description: "Copy your shortened link and share it across the web.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* ───── Hero ───── */}
      <section className="relative flex flex-col items-center px-4 pb-24 pt-20 text-center">
        {/* Subtle gradient glow behind the heading */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-72 w-full max-w-2xl rounded-full bg-primary/5 blur-3xl dark:bg-primary/10"
        />

        <div className="relative z-10 flex max-w-2xl flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <CheckCircle2 className="size-4 text-primary" />
            Free &amp; open to everyone
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Shorten your links,
            <br />
            <span className="text-primary">not your reach.</span>
          </h1>

          <p className="max-w-lg text-lg leading-8 text-muted-foreground">
            Turn long, unwieldy URLs into clean, memorable short links. Share
            with confidence, track performance, and grow your audience.
          </p>

          <LandingCTA />
        </div>
      </section>

      {/* ───── Features ───── */}
      <section className="border-t bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need
            </h2>
            <p className="mt-3 text-muted-foreground">
              Powerful features to manage and track every link you share.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How it works ───── */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three simple steps to start shortening.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className="relative flex flex-col items-center text-center">
                {/* Connector line (hidden on mobile) */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-border sm:block" />
                )}

                <div className="relative z-10 mb-4 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                  <Icon className="size-6" />
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Bottom CTA ───── */}
      <section className="border-t bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to shorten your links?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join thousands of users who trust us to make their links cleaner,
            smarter, and more shareable.
          </p>
          <div className="mt-8 flex justify-center">
            <LandingCTA />
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Link Shortener. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

