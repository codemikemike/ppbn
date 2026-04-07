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
