# UC015 — Staff — Rate Staff

## Use Case Name

Rate Staff

## Actor

RegisteredUser (Authenticated)

## Preconditions

- User is authenticated
- User is viewing an approved, active staff profile at `/staff/[id]`
- The staff profile exists, is approved, active, and not soft-deleted

## Main Flow

1. User navigates to a staff profile page
2. System displays the staff profile and an interactive star rating control (1–5)
3. System shows the user's existing rating (if any)
4. User selects a star rating (1–5)
5. System submits the rating to the server
6. System upserts the rating for (staffProfileId, userId)
7. System returns:
   - the updated average rating for the staff profile
   - the user's current rating
8. System updates the UI accordingly

## Alternative Flows

### 1a. Staff Profile Not Found / Not Publicly Visible

1. System cannot find an approved and active staff profile for the id
2. System returns `404 Not Found`

### 4a. User Not Authenticated

1. System shows "Login to rate"
2. System does not allow submission

### 5a. Validation Error

1. System rejects invalid rating values (not an integer 1–5)
2. System returns `400 Bad Request`

### 5b. Network / Server Error

1. System fails to persist the rating
2. System shows a generic error message

## Postconditions

### Success

- A StaffRating row exists for (staffProfileId, userId)
- `StaffRating.rating` equals the user's submitted rating
- Average rating shown on the staff profile reflects the new aggregate

### Failure

- No data is changed
- UI displays an error and retains the previous value

## Business Rules

1. A user can rate a staff profile at most once (enforced by `@@unique([staffProfileId, userId])`)
2. Only approved and active staff profiles are rateable via the public UI
3. Rating is an integer from 1 to 5 inclusive
4. Rating requires authentication

## Special Requirements

1. Client UI should show the user's existing rating when logged in
2. API returns `{ averageRating: number, userRating: number }`
3. Clean Architecture boundaries must be respected (API → Service → Repository → DB)

## Frequency of Use

Medium — depends on user engagement

## Open Issues

1. Should we allow rating comments here or separate UC? (Decision: rating-only for UC015)
