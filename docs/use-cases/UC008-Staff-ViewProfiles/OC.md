# UC008 — Operation Contracts (OC)

## Operation: List approved staff profiles

**Name**: `listApprovedStaffProfiles`

**Trigger**: `GET /api/staff?bar=optional`

**Preconditions**:

- None.

**Postconditions**:

- Returns a list of staff profiles where:
  - `isApproved = true`
  - `isActive = true`
  - `deletedAt = null`
- If `bar` is provided, returned profiles also satisfy `currentBar = bar`.

**Inputs**:

- `bar?: string`

**Outputs**:

- `StaffProfileDto[]`

---

## Operation: Get approved staff profile by id

**Name**: `getApprovedStaffProfileById`

**Trigger**: `GET /api/staff/:id`

**Preconditions**:

- `id` is provided.

**Postconditions**:

- If profile exists and is publicly visible, returns detail DTO including:
  - `averageRating`
  - `ratings[]` (staff ratings with optional comments)
- If not found or not publicly visible, returns not found.

**Inputs**:

- `id: string`

**Outputs**:

- `StaffProfileDetailDto`
