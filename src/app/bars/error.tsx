"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

/**
 * Error boundary for the bars route segment.
 *
 * @param props Error boundary props.
 * @returns Error UI with retry.
 */
export default function BarsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;

  return (
    <main className="ppbn-page mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Bars</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Something went wrong while loading bars.
      </p>
      <Button className="ppbn-button mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </main>
  );
}
