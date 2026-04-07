/**
 * Event type values.
 */
export type EventType =
  | "DJNight"
  | "LadiesNight"
  | "LiveMusic"
  | "HappyHour"
  | "ThemeNight"
  | "SpecialEvent";

/**
 * Public event representation for list and detail views.
 */
export type EventDto = {
  id: string;
  title: string;
  description: string | null;
  eventType: EventType;
  startTime: Date;
  endTime: Date | null;
  barId: string;
  barName: string;
  barSlug: string;
  imageUrl: string | null;
  imageAlt: string | null;
};
