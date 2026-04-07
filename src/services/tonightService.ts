import type { BarDto } from "@/domain/dtos/BarDto";
import type { BarCategory } from "@/domain/dtos/BarCategory";
import type { EventDto } from "@/domain/dtos/EventDto";
import type { TonightDto } from "@/domain/dtos/TonightDto";
import type { IBarRepository } from "@/domain/interfaces/IBarRepository";
import type { IEventRepository } from "@/domain/interfaces/IEventRepository";
import { barRepository } from "@/repositories/barRepository";
import { eventRepository } from "@/repositories/eventRepository";

/**
 * Application service for loading Tonight data.
 */
export type TonightService = {
  /**
   * Loads all data needed for the Tonight page in a single operation.
   */
  getTonightData: () => Promise<TonightDto>;
};

const PHNOM_PENH_OFFSET = "+07:00";
const PHNOM_PENH_TIME_ZONE = "Asia/Phnom_Penh";
const TONIGHT_REFERENCE_HOUR = 20;

const pad2 = (value: number) => String(value).padStart(2, "0");

const getPhnomPenhDateParts = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: PHNOM_PENH_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  if (!year || !month || !day) {
    const fallback = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };

    return {
      year: String(fallback.year),
      month: pad2(fallback.month),
      day: pad2(fallback.day),
    };
  }

  return { year, month, day };
};

const getTonightWindow = (now: Date) => {
  const { year, month, day } = getPhnomPenhDateParts(now);
  const isoDate = `${year}-${month}-${day}`;

  const startOfDay = new Date(`${isoDate}T00:00:00${PHNOM_PENH_OFFSET}`);
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const referenceTonight = new Date(
    `${isoDate}T${pad2(TONIGHT_REFERENCE_HOUR)}:00:00${PHNOM_PENH_OFFSET}`,
  );

  return { isoDate, startOfDay, endOfDay, referenceTonight };
};

const isLiveMusicEvent = (event: EventDto): boolean => {
  return event.eventType === "LiveMusic";
};

const isLiveMusicCategory = (category: BarCategory): boolean => {
  return category === "LiveMusic";
};

const uniqueById = <T extends { id: string }>(items: T[]): T[] => {
  const map = new Map<string, T>();
  for (const item of items) {
    if (!map.has(item.id)) map.set(item.id, item);
  }
  return Array.from(map.values());
};

/**
 * Creates a tonight service using the given repositories.
 * @param barRepo Bar repository implementation.
 * @param eventRepo Event repository implementation.
 */
export const createTonightService = (
  barRepo: IBarRepository,
  eventRepo: IEventRepository,
): TonightService => ({
  getTonightData: async () => {
    const { isoDate, startOfDay, endOfDay, referenceTonight } =
      getTonightWindow(new Date());

    const [eventsTonight, openBars, featuredBars] = await Promise.all([
      eventRepo.findVisibleOverlappingRange(startOfDay, endOfDay),
      barRepo.findOpenBarsAt(referenceTonight),
      barRepo.findFeaturedBars(),
    ]);

    const liveMusicOpenBars = openBars.filter((bar) =>
      isLiveMusicCategory(bar.category),
    );

    const liveMusicEventBarIds = Array.from(
      new Set(eventsTonight.filter(isLiveMusicEvent).map((e) => e.barId)),
    );

    const liveMusicEventBars =
      liveMusicEventBarIds.length > 0
        ? await barRepo.findByIds(liveMusicEventBarIds)
        : ([] satisfies BarDto[]);

    const liveMusicVenues = uniqueById([
      ...liveMusicOpenBars,
      ...liveMusicEventBars,
    ]).sort((a, b) => a.name.localeCompare(b.name));

    return {
      date: isoDate,
      eventsTonight,
      openBars,
      featuredBars,
      liveMusicVenues,
    };
  },
});

/**
 * Default tonight service.
 */
export const tonightService = createTonightService(
  barRepository,
  eventRepository,
);
