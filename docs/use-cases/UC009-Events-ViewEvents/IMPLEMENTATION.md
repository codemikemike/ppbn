# UC009 — Implementation Notes

## Key decisions

- Public visibility is enforced in repository queries (`isApproved`, `deletedAt`, and time window).
- Upcoming/current is defined as `startTime >= now` OR `endTime >= now`.
- Calendar view is implemented as a minimal alternative rendering on the same page.

## Non-goals

- Creating/editing events.
- Admin approval flows.
