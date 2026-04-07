"use client";

import "leaflet/dist/leaflet.css";

import Link from "next/link";
import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { BarDto } from "@/domain/dtos/BarDto";

export type BarMapProps = {
  /**
   * Bars to render as markers (bars without coordinates are ignored).
   */
  bars: BarDto[];
};

const PHNOM_PENH_CENTER: [number, number] = [11.5564, 104.9282];
const DEFAULT_ZOOM = 13;

/**
 * Interactive bar map using Leaflet.
 */
export default function BarMap({ bars }: BarMapProps) {
  useEffect(() => {
    // Fix Leaflet default marker icon
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
      ._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const markerBars = bars.filter(
    (bar): bar is BarDto & { latitude: number; longitude: number } =>
      typeof bar.latitude === "number" && typeof bar.longitude === "number",
  );

  return (
    <section aria-label="Map" className="mt-6">
      <div className="h-[70vh] w-full overflow-hidden rounded-md border">
        <MapContainer
          center={PHNOM_PENH_CENTER}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {markerBars.map((bar) => (
            <Marker key={bar.id} position={[bar.latitude, bar.longitude]}>
              <Popup>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{bar.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {bar.category} • {bar.area}
                  </p>
                  <Link
                    href={`/bars/${bar.slug}`}
                    className="text-xs hover:underline"
                  >
                    View bar
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {markerBars.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No bars with coordinates found.
        </p>
      ) : null}
    </section>
  );
}
