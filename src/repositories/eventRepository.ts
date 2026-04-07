import { db } from "@/lib/db";
import type { EventDto } from "@/domain/dtos/EventDto";
import type { IEventRepository } from "@/domain/interfaces/IEventRepository";
import type { Event } from "@/generated/prisma";

const toEventDto = (
  event: Event & {
    bar: {
      id: string;
      name: string;
      slug: string;
    };
  },
): EventDto => {
  return {
    id: event.id,
    title: event.title,
    description: event.description ?? null,
    eventType: event.eventType,
    startTime: event.startTime,
    endTime: event.endTime ?? null,
    barId: event.bar.id,
    barName: event.bar.name,
    barSlug: event.bar.slug,
    imageUrl: event.imageUrl ?? null,
    imageAlt: event.imageAlt ?? null,
  };
};

/**
 * Event repository implementation backed by Prisma.
 */
export const eventRepository: IEventRepository = {
  /**
   * Lists publicly visible events that overlap the given time range.
   * @param start Inclusive start.
   * @param end Exclusive end.
   */
  async findVisibleOverlappingRange(
    start: Date,
    end: Date,
  ): Promise<EventDto[]> {
    const events = await db.event.findMany({
      where: {
        isApproved: true,
        deletedAt: null,
        bar: {
          isApproved: true,
          deletedAt: null,
        },
        AND: [
          {
            startTime: {
              lt: end,
            },
          },
          {
            OR: [
              {
                endTime: null,
                startTime: {
                  gte: start,
                },
              },
              {
                endTime: {
                  not: null,
                  gte: start,
                },
              },
            ],
          },
        ],
      },
      include: {
        bar: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ startTime: "asc" }],
    });

    return events.map((event) => toEventDto(event));
  },
};
import { db } from "@/lib/db";
import type { EventDto } from "@/domain/dtos/EventDto";
import type {
  IEventRepository,
  UpcomingEventFilters,
} from "@/domain/interfaces/IEventRepository";
import type { Event } from "@/generated/prisma";

const toEventDto = (
  event: Event & {
    bar: {
      id: string;
      name: string;
      slug: string;
    };
  },
): EventDto => {
  return {
    id: event.id,
    title: event.title,
    description: event.description ?? null,
    eventType: event.eventType,
    startTime: event.startTime,
    endTime: event.endTime ?? null,
    barId: event.bar.id,
    barName: event.bar.name,
    barSlug: event.bar.slug,
    imageUrl: event.imageUrl ?? null,
    imageAlt: event.imageAlt ?? null,
  };
};

const normalizeFilters = (filters: UpcomingEventFilters) => {
  const trimmedBarId = filters.barId?.trim();
  const barId = trimmedBarId ? trimmedBarId : undefined;

  return {
    type: filters.type,
    barId,
  };
};

const buildUpcomingWhere = (now: Date, filters: UpcomingEventFilters) => {
  const normalized = normalizeFilters(filters);

  return {
    isApproved: true,
    deletedAt: null,
    ...(normalized.type ? { eventType: normalized.type } : {}),
    ...(normalized.barId ? { barId: normalized.barId } : {}),
    OR: [
      {
        startTime: {
          gte: now,
        },
      },
      {
        endTime: {
          not: null,
          gte: now,
        },
      },
    ],
  };
};

/**
 * Event repository backed by Prisma.
 */
export const eventRepository: IEventRepository = {
  /**
   * Lists upcoming/current approved events.
   * @param filters Optional filters.
   */
  async findUpcoming(filters: UpcomingEventFilters): Promise<EventDto[]> {
    const now = new Date();

    const events = await db.event.findMany({
      where: buildUpcomingWhere(now, filters),
      include: {
        bar: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [{ startTime: "asc" }],
    });

    return events.map((event) => toEventDto(event));
  },

  /**
   * Finds a single upcoming/current approved event by id.
   * @param id Event id.
   */
  async findUpcomingById(id: string): Promise<EventDto | null> {
    const now = new Date();

    const event = await db.event.findFirst({
      where: {
        ...buildUpcomingWhere(now, {}),
        id,
      },
      include: {
        bar: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!event) return null;

    return toEventDto(event);
  },
};
