import type { EventDto, EventType } from "@/domain/dtos/EventDto";
import { NotFoundError } from "@/domain/errors/DomainErrors";
import type {
  IEventRepository,
  UpcomingEventFilters,
} from "@/domain/interfaces/IEventRepository";
import { eventRepository } from "@/repositories/eventRepository";

export type EventService = {
  /**
   * Lists upcoming/current approved events.
   * @param filters Optional filters.
   */
  listUpcomingEvents: (filters?: UpcomingEventFilters) => Promise<EventDto[]>;

  /**
   * Gets an upcoming/current approved event by id.
   * @param id Event id.
   * @throws NotFoundError when the event does not exist or is not publicly visible.
   */
  getUpcomingEventById: (id: string) => Promise<EventDto>;
};

const isEventType = (value: string): value is EventType => {
  return (
    value === "DJNight" ||
    value === "LadiesNight" ||
    value === "LiveMusic" ||
    value === "HappyHour" ||
    value === "ThemeNight" ||
    value === "SpecialEvent"
  );
};

const normalizeFilters = (
  filters?: UpcomingEventFilters,
): UpcomingEventFilters => {
  const type = filters?.type;
  const barId = filters?.barId?.trim();

  return {
    type,
    barId: barId ? barId : undefined,
  };
};

/**
 * Creates an event service using the given repository.
 * @param repo Repository implementation.
 */
export const createEventService = (repo: IEventRepository): EventService => ({
  listUpcomingEvents: async (filters?: UpcomingEventFilters) => {
    return repo.findUpcoming(normalizeFilters(filters));
  },
  getUpcomingEventById: async (id: string) => {
    const event = await repo.findUpcomingById(id);
    if (!event) {
      throw new NotFoundError("Event not found");
    }
    return event;
  },
});

/**
 * Default event service.
 */
export const eventService = createEventService(eventRepository);

/**
 * Parses an event type filter value.
 * @param value Query string value.
 */
export const parseEventTypeFilter = (
  value: string | null,
): EventType | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (!isEventType(trimmed)) return undefined;
  return trimmed;
};
