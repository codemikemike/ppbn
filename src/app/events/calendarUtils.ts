import type { EventDto } from "@/domain/dtos/EventDto";

export function buildCalendar(events: EventDto[]) {
  const monthBase = events[0]?.startTime
    ? new Date(events[0].startTime)
    : new Date();
  const year = monthBase.getFullYear();
  const month = monthBase.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday=0
  const daysInMonth = lastDay.getDate();

  const cells: Array<{ date: Date | null; events: EventDto[] }> = [];

  for (let i = 0; i < startWeekday; i++) {
    cells.push({ date: null, events: [] });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayEvents = events.filter((e) => {
      const d = new Date(e.startTime);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });
    cells.push({ date, events: dayEvents });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, events: [] });
  }

  const monthLabel = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
  }).format(firstDay);

  return { monthLabel, cells };
}
