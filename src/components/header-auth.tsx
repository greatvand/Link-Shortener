"use client";

import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function HeaderAuth() {
  return (
    <div className="flex items-center gap-3">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button variant="secondary" size="sm">Sign In</Button>
        </SignInButton>
        <SignUpButton mode="modal">
          <Button variant="outline" size="sm">Sign Up</Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              userButtonBox: "size-9",
            },
          }}
        />
      </Show>
    </div>
  );
}
