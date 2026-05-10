"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { updateLink, deleteLink } from "@/app/actions";
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

type Link = {
  id: string;
  slug: string;
  originalUrl: string;
  isActive: boolean;
};

// ── Edit Dialog ──────────────────────────────────────────

function EditLinkDialog({
  link,
  open,
  onOpenChange,
}: {
  link: Link;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, formAction, isPending] = useActionState(updateLink, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
          <DialogDescription>
            Update the destination or customize your short slug.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="linkId" value={link.id} />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-originalUrl" className="text-xs font-medium">
              Destination URL
            </label>
            <Input
              id="edit-originalUrl"
              name="originalUrl"
              type="url"
              defaultValue={link.originalUrl}
              placeholder="https://example.com"
              required
              autoComplete="url"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="edit-slug" className="text-xs font-medium">
              Short slug
            </label>
            <div className="flex items-center rounded-lg border border-input bg-transparent has-focus:border-ring has-focus:ring-3 has-focus:ring-ring/50 dark:bg-input/30">
              <span className="pl-2.5 text-xs text-muted-foreground">/</span>
              <Input
                id="edit-slug"
                name="slug"
                defaultValue={link.slug}
                placeholder="my-cool-link"
                className="border-0 bg-transparent focus-visible:ring-0 dark:bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="edit-isActive"
              name="isActive"
              value="true"
              defaultChecked={link.isActive}
              className="size-3.5 rounded border-input"
            />
            <label htmlFor="edit-isActive" className="text-xs font-medium">
              Active (link can be visited)
            </label>
          </div>

          {state?.error && (
            <p className="text-xs text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete Dialog ────────────────────────────────────────

function DeleteLinkDialog({
  link,
  open,
  onOpenChange,
}: {
  link: Link;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, formAction, isPending] = useActionState(deleteLink, null);

  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete link</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this link? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="linkId" value={link.id} />

          <div className="rounded-lg border px-3 py-2">
            <p className="truncate text-xs font-medium">{link.originalUrl}</p>
            <p className="truncate text-xs text-muted-foreground">
              /{link.slug}
            </p>
          </div>

          {state?.error && (
            <p className="text-xs text-destructive">{state.error}</p>
          )}

          <DialogFooter>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Deleting..." : "Delete Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Public row-actions component ─────────────────────────

export function LinkRowActions({ link }: { link: Link }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setEditOpen(true)}
        aria-label="Edit link"
      >
        <Pencil className="size-3" />
      </Button>

      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setDeleteOpen(true)}
        aria-label="Delete link"
      >
        <Trash2 className="size-3 text-destructive" />
      </Button>

      <EditLinkDialog link={link} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteLinkDialog
        link={link}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}
