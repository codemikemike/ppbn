# UC009 — Events — View Events

## Actors

- Visitor
- RegisteredUser

## Preconditions

- Events exist.
- Events are approved and not soft-deleted:
  - `isApproved = true`
  - `deletedAt = null`

## Trigger

- User navigates to `/events`.

## Main Flow

1. User opens the events list page.
2. System loads upcoming/current approved events sorted by start time.
3. System displays each event with:
   - Event name
   - Date
   - Time
   - Bar name
   - Event type
4. User optionally filters events by event type.
5. User optionally switches to a calendar view.
6. User selects an event.
7. System navigates to `/events/[id]`.
8. System loads the upcoming/current approved event by id.
9. System displays event details and bar info.
10. User can navigate back to the bar detail page.

## Postconditions

- User can discover upcoming events and view event details.

## Business Rules

- Only upcoming/current events are visible:
  - `startTime >= now` OR (`endTime != null` AND `endTime >= now`).
- Only approved events are visible: `isApproved = true`.
- Soft-deleted events are hidden: `deletedAt = null`.
