import { beforeAll, describe, expect, it, vi } from "vitest";

import type { EventDto } from "@/domain/dtos/EventDto";
import { NotFoundError } from "@/domain/errors/DomainErrors";

const findUpcomingMock = vi.fn();
const findUpcomingByIdMock = vi.fn();

vi.mock("@/repositories/eventRepository", () => {
  return {
    eventRepository: {
      findUpcoming: findUpcomingMock,
      findUpcomingById: findUpcomingByIdMock,
    },
  };
});

let eventService: typeof import("../eventService").eventService;

beforeAll(async () => {
  ({ eventService } = await import("../eventService"));
});

describe("eventService.listUpcomingEvents", () => {
  it("passes filters to the repository", async () => {
    const startTime = new Date("2026-04-08T19:00:00.000Z");

    const events: EventDto[] = [
      {
        id: "evt_1",
        title: "DJ Night",
        description: null,
        eventType: "DJNight",
        startTime,
        endTime: null,
        barId: "bar_1",
        barName: "Rose Bar",
        barSlug: "rose-bar",
        imageUrl: null,
        imageAlt: null,
      },
    ];

    findUpcomingMock.mockResolvedValueOnce(events);

    const result = await eventService.listUpcomingEvents({
      type: "DJNight",
      barId: "  bar_1  ",
    });

    expect(result).toEqual(events);
    expect(findUpcomingMock).toHaveBeenCalledWith({
      type: "DJNight",
      barId: "bar_1",
    });
  });
});

describe("eventService.getUpcomingEventById", () => {
  it("returns an event when found", async () => {
    const startTime = new Date("2026-04-08T19:00:00.000Z");

    const event: EventDto = {
      id: "evt_1",
      title: "DJ Night",
      description: "All night long",
      eventType: "DJNight",
      startTime,
      endTime: null,
      barId: "bar_1",
      barName: "Rose Bar",
      barSlug: "rose-bar",
      imageUrl: null,
      imageAlt: null,
    };

    findUpcomingByIdMock.mockResolvedValueOnce(event);

    await expect(eventService.getUpcomingEventById("evt_1")).resolves.toEqual(
      event,
    );
  });

  it("throws NotFoundError when missing", async () => {
    findUpcomingByIdMock.mockResolvedValueOnce(null);

    await expect(
      eventService.getUpcomingEventById("missing"),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});
