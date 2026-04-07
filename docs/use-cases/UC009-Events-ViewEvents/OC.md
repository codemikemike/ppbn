# UC009 — Operation Contracts (OC)

## Operation: List upcoming approved events

**Name**: `listUpcomingEvents`

**Trigger**: `GET /api/events?type=&barId=`

**Preconditions**:

- None.

**Postconditions**:

- Returns events where:
  - `isApproved = true`
  - `deletedAt = null`
  - `startTime >= now` OR (`endTime != null` AND `endTime >= now`)
- If `type` provided, events also match `eventType = type`.
- If `barId` provided, events also match `barId = barId`.

**Inputs**:

- `type?: EventType`
- `barId?: string`

**Outputs**:

- `EventDto[]`

---

## Operation: Get upcoming approved event by id

**Name**: `getUpcomingEventById`

**Trigger**: `GET /api/events/:id`

**Preconditions**:

- `id` is provided.

**Postconditions**:

- If event exists and is upcoming/current and visible, returns `EventDto`.
- Otherwise returns not found.

**Inputs**:

- `id: string`

**Outputs**:

- `EventDto`
