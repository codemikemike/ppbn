import type { EventDto } from "../dtos/EventDto";

/**
 * Event repository contract.
 */
export interface IEventRepository {
  /**
   * Lists publicly visible events that overlap the given time range.
   *
   * Range is treated as [start, end) in terms of day boundaries.
   *
   * @param start Inclusive start.
   * @param end Exclusive end.
   */
  findVisibleOverlappingRange(start: Date, end: Date): Promise<EventDto[]>;
}
import type { EventDto, EventType } from "../dtos/EventDto";

/**
 * Upcoming event filters.
 */
export type UpcomingEventFilters = {
  type?: EventType;
  barId?: string;
};

/**
 * Event repository contract.
 */
export type IEventRepository = {
  /**
   * Lists upcoming/current approved events.
   * @param filters Optional filters.
   */
  findUpcoming: (filters: UpcomingEventFilters) => Promise<EventDto[]>;

  /**
   * Finds a single upcoming/current approved event by id.
   * @param id Event id.
   */
  findUpcomingById: (id: string) => Promise<EventDto | null>;
};
