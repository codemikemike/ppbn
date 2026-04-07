# UC011 — Operation Contracts (OC)

## Operation: List bars with coordinates for map

**Name**: `listMapBars`

**Trigger**: `GET /api/map?area=&category=`

**Preconditions**:

- None.

**Postconditions**:

- Returns bars where:
  - `isApproved = true`
  - `deletedAt = null`
- Optional filters:
  - If `area` provided, `bar.area = area`.
  - If `category` provided, `bar.category = category`.
- Only bars with both `latitude` and `longitude` are returned.

**Inputs**:

- `area?: BarArea`
- `category?: BarCategory`

**Outputs**:

- `BarDto[]`
