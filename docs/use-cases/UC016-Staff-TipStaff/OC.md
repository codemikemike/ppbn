# UC016 — Operation Contracts

## Operation 1: tipStaff

### Contract: tipStaff(staffId: string, userId: string, amount: number, message?: string): TipStaffResultDto

**Cross-References**: UC016 Main Flow Steps 7–11

**Preconditions**:

- `staffId` is not null or empty
- `userId` is not null or empty
- `amount` is a number in [$1, $100]
- The user is authenticated
- An approved, active, non-deleted StaffProfile exists with `id = staffId`

**Postconditions**:

- A `StaffTip` row is created with:
  - `staffProfileId = staffId`
  - `userId = userId`
  - `amount = amount`
  - `currency = USD`
  - `message = message` (if provided)
  - `createdAt` set by the database
- Returns `{ success: true, tipId }`

## Invariants

1. Tips require authentication
2. Tip amount is within $1–$100 inclusive
3. Tips are only allowed for approved and active staff profiles via the public UI
