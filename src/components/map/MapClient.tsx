"use client";

import dynamic from "next/dynamic";

import type { BarDto } from "@/domain/dtos/BarDto";

export type MapClientProps = {
  /**
   * Bars to render on the map.
   */
  bars: BarDto[];
};

const BarMap = dynamic(() => import("@/components/map/BarMap"), {
  ssr: false,
  loading: () => (
    <div className="mt-6 rounded-md border p-6 text-sm text-muted-foreground">
      Loading map...
    </div>
  ),
});

/**
 * Client wrapper for the interactive map (no SSR).
 * @param props - Component props.
 * @param props.bars - Bars to render as map markers.
 * @returns The interactive map UI.
 */
export default function MapClient({ bars }: MapClientProps) {
  return <BarMap bars={bars} />;
}
