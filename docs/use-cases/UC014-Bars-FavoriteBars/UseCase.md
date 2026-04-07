# UC014 — Bars — Favorite Bars

## Use Case Name

Favorite Bars

## Actor

RegisteredUser (Authenticated)

## Preconditions

- User is authenticated
- User is viewing an approved bar detail page at `/bars/[slug]` OR viewing `/dashboard/favorites`
- The bar exists, is approved, and is not soft-deleted

## Main Flow (Toggle Favorite from Bar Detail)

1. User navigates to a bar detail page
2. System displays the bar name and a heart icon (favorite button)
3. User clicks the heart icon
4. System toggles the favorite state:
   - If the bar was not favorited, it becomes favorited
   - If the bar was favorited, it becomes unfavorited
5. System updates the UI immediately (optimistic update)
6. System persists the change
7. System returns the new favorite state

## Main Flow (View Favorites in Dashboard)

1. User navigates to `/dashboard/favorites`
2. System loads the user’s favorite bars
3. System displays a list of favorite bars
4. Each list item links to `/bars/[slug]`
5. User can click "Remove" on a bar
6. System removes the bar from favorites
7. System refreshes the list

## Alternative Flows

### 3a. User Not Authenticated (Bar Detail)

1. System displays an unfavorited heart icon
2. When user hovers/focuses the icon, system shows tooltip: "Login to save favorites"
3. Clicking does not toggle favorites

### 4a. Bar Not Found / Not Approved

1. System cannot find an approved bar for the provided slug
2. System returns `404 Not Found`
3. UI remains unchanged

### 6a. Network or Server Error

1. System fails to persist the toggle
2. System reverts optimistic UI update
3. System shows a generic error message

## Postconditions

### Success

- A FavoriteBar relation exists for (userId, barId) if favorited
- No FavoriteBar relation exists for (userId, barId) if unfavorited
- Dashboard favorites list reflects the change

### Failure

- Favorite state in the database is unchanged
- UI is reverted to the previous state

## Business Rules

1. Favorites are per-user
2. A bar can be favorited at most once per user (`@@unique([userId, barId])`)
3. Only approved, non-deleted bars can be favorited
4. Favorites require authentication

## Special Requirements

1. Favorite toggle must be optimistic in the bar detail UI
2. API returns `{ isFavorited: boolean }`
3. Clean Architecture boundaries must be respected (API → Service → Repository → DB)

## Frequency of Use

Medium to High — multiple times per user session

## Open Issues

1. Should favorites be soft-deleted instead of hard-deleted? (Decision: hard-delete for now)
2. Should unfavoriting require confirmation? (Decision: no, single click/remove)
