"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function LandingCTA() {
  return (
    <div className="flex items-center gap-4">
      <SignUpButton mode="modal">
        <Button size="lg" className="gap-2">
          Start for free
          <ArrowRight className="size-4" />
        </Button>
      </SignUpButton>
      <SignInButton mode="modal">
        <Button variant="outline" size="lg">
          Sign in
        </Button>
      </SignInButton>
    </div>
  );
}
