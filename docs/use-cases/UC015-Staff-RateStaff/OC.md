# UC015 — Operation Contracts

## Operation 1: rateStaff

### Contract: rateStaff(staffId: string, userId: string, rating: number): RateStaffResultDto

**Cross-References**: UC015 Main Flow Steps 4–8

**Preconditions**:

- `staffId` is not null or empty
- `userId` is not null or empty
- `rating` is an integer in [1, 5]
- An approved, active, non-deleted StaffProfile exists with `id = staffId`
- The user is authenticated

**Postconditions**:

- A StaffRating row exists for (staffProfileId = staffId, userId)
- If an existing rating row existed:
  - Its `rating` is updated
  - `updatedAt` changes
- If no rating row existed:
  - A new StaffRating row is created
- Returns `{ averageRating, userRating }` where:
  - `userRating` equals the submitted `rating`
  - `averageRating` is the average of all StaffRating rows for the staff profile

## Operation 2: getUserRating

### Contract: getUserRating(staffId: string, userId: string): number | null

**Preconditions**:

- `staffId` is not null or empty
- `userId` is not null or empty
- The user is authenticated

**Postconditions**:

- Returns the user's existing rating (1-5) if present
- Returns null if no rating exists
- No data is modified

## Invariants

1. `(staffProfileId, userId)` is unique for StaffRating
2. Rating is integer 1–5
3. Ratings require authentication
