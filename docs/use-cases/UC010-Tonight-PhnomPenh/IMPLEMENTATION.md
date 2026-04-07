# UC010 — Implementation Notes

## Key decisions

- Phnom Penh is treated as a fixed UTC+07:00 time zone for determining "today".
- "Open tonight" is evaluated using a fixed reference time of 20:00 local time.
- Event visibility and bar visibility are enforced at query time.

## Non-goals

- Creating/editing events.
- Admin approval flows.
- Advanced scheduling or per-day opening hours.
