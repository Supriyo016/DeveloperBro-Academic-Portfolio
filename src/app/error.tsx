"use client";

import { Button, ButtonLink } from "@/components/ui/primitives";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container-page max-w-2xl pt-16">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">This page could not be loaded</h1>
      <p className="mt-4 text-lg text-ink-2">Please try again. If it keeps happening, the rest of the site should still work.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="secondary">Back to home</ButtonLink>
      </div>
    </div>
  );
}
