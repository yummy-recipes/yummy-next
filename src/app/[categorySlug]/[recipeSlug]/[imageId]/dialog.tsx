"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { redirect } from "next/navigation";

interface Props {
  categorySlug: string;
  recipeSlug: string;
  children: React.ReactNode;
}
export function GalleryDialog({ categorySlug, recipeSlug, children }: Props) {
  const handleClose = () => {
    redirect(`/${categorySlug}/${recipeSlug}`);
  };

  return (
    <Dialog open onClose={handleClose} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded bg-white">
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
