# UC016 — Staff — Tip Staff

## Use Case Name

Tip Staff

## Actor

RegisteredUser (Authenticated)

## Preconditions

- User is authenticated
- User is viewing an approved, active staff profile at `/staff/[id]`
- The staff profile exists, is approved, active, and not soft-deleted

## Main Flow

1. User navigates to a staff profile page
2. System displays a "Tip" button
3. User opens the tip modal/dialog
4. System shows preset tip amounts: $1, $2, $5, $10, $20 and a custom amount input
5. User selects a preset amount or enters a custom amount
6. User optionally enters a message
7. User submits the tip
8. System validates the request (`amount` is between $1 and $100)
9. System creates a `StaffTip` record linked to `(staffProfileId, userId)`
10. System returns `{ success: true, tipId }`
11. System shows a success message and closes the modal

## Alternative Flows

### 2a. User Not Authenticated

1. System shows "Login to tip"
2. System does not allow submission

### 8a. Validation Error

1. System rejects invalid `amount` values (less than $1 or greater than $100)
2. System returns `400 Bad Request`
3. System shows an error message

### 9a. Staff Profile Not Found / Not Publicly Visible

1. System cannot find an approved and active staff profile for the id
2. System returns `404 Not Found`

### 7a. Network / Server Error

1. System fails to persist the tip record
2. System returns `500 Internal Server Error`
3. System shows a generic error message

## Postconditions

### Success

- A `StaffTip` row exists with:
  - `staffProfileId` = the viewed staff profile id
  - `userId` = the current user id
  - `amount` = submitted amount
  - `currency` = `USD`
  - `message` = optional message (if provided)

### Failure

- No data is changed
- UI displays an error and allows retry

## Business Rules

1. Tipping requires authentication
2. Only approved and active staff profiles are tippable via the public UI
3. Tip `amount` must be within $1–$100 inclusive
4. Tip `message` is optional

## Special Requirements

1. UI uses a modal/dialog for tipping
2. Preset amounts are fixed to $1, $2, $5, $10, $20
3. API route is `POST /api/staff/:id/tip`
4. API returns `{ success: boolean, tipId: string }`
5. Clean Architecture boundaries must be respected (API → Service → Repository → DB)

## Frequency of Use

Medium — depends on user engagement

## Open Issues

1. Payments are not processed in this UC; the system records tip intent only.
