import type { BarDto } from "./BarDto";
import type { EventDto } from "./EventDto";

/**
 * Combined response for the Tonight page.
 */
export type TonightDto = {
  /**
   * Current Phnom Penh date in ISO format (YYYY-MM-DD).
   */
  date: string;

  /**
   * Events happening tonight (today).
   */
  eventsTonight: EventDto[];

  /**
   * Bars open tonight.
   */
  openBars: BarDto[];

  /**
   * Featured bars.
   */
  featuredBars: BarDto[];

  /**
   * Live music venues tonight.
   */
  liveMusicVenues: BarDto[];
};
