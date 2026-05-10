"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

import { createLink } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateLinkDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createLink, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Close dialog + reset form on success
  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      formRef.current?.reset();
    }
  }, [state]);

  // Reset action state when dialog opens
  useEffect(() => {
    if (open) {
      // State resets implicitly when form is submitted again,
      // but we could clear it here if needed
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a short link</DialogTitle>
          <DialogDescription>
            Enter a long URL and optionally customize the short slug.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="create-originalUrl" className="text-xs font-medium">
              Destination URL
            </label>
            <Input
              id="create-originalUrl"
              name="originalUrl"
              type="url"
              placeholder="https://example.com/very-long-url"
              required
              autoComplete="url"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="create-slug" className="text-xs font-medium">
              Custom slug{" "}
              <span className="text-muted-foreground">(optional)</span>
            </label>
            <div className="flex items-center rounded-lg border border-input bg-transparent has-focus:border-ring has-focus:ring-3 has-focus:ring-ring/50 dark:bg-input/30">
              <span className="pl-2.5 text-xs text-muted-foreground">/</span>
              <Input
                id="create-slug"
                name="slug"
                placeholder="my-cool-link"
                className="border-0 bg-transparent focus-visible:ring-0 dark:bg-transparent"
              />
            </div>
          </div>

          {state?.error && (
            <p className="text-xs text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating..." : "Create Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
