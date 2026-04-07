# UC010 — Operation Contracts (OC)

## Operation: Get tonight data

**Name**: `getTonightData`

**Triggers**:

- Page render: `GET /tonight`
- API: `GET /api/tonight`

**Preconditions**:

- None.

**Postconditions**:

- Returns a single combined response containing:
  - `date`: Phnom Penh current date.
  - `eventsTonight`: public events overlapping today.
  - `openBars`: public bars open tonight derived from `openingHours`.
  - `liveMusicVenues`: bars associated with live music tonight.
  - `featuredBars`: public featured bars.

**Visibility rules**:

- Bars: `isApproved = true` and `deletedAt = null`.
- Events: `isApproved = true` and `deletedAt = null` and bar is approved and not deleted.

**Inputs**:

- None.

**Outputs**:

- `TonightDto`
