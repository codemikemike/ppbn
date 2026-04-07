# UC008 — Staff — View Profiles

## Actors

- Visitor
- RegisteredUser

## Preconditions

- Staff profiles exist.
- Profiles are approved and active:
  - `isApproved = true`
  - `isActive = true`
  - `deletedAt = null`

## Trigger

- User navigates to `/staff`.

## Main Flow

1. User opens the staff profiles list page.
2. System loads all approved staff profiles.
3. System displays each staff profile with:
   - Profile image
   - Name
   - Role (position)
   - Bar name
   - Average rating
4. User optionally filters staff profiles by bar.
5. User selects a staff profile.
6. System navigates to `/staff/[id]`.
7. System loads the approved staff profile by id.
8. System displays staff profile detail:
   - Profile image
   - Name + initials
   - Role (position)
   - Description (bio)
   - Gallery images
   - Average rating
   - Reviews/comments (staff ratings)

## Postconditions

- User can view public staff profile information.

## Business Rules

- Only approved and active profiles are visible.
- Average rating is computed from `staff_ratings.rating`.
- Reviews/comments are taken from `staff_ratings.comment`.
- Filtering by bar matches `staff_profiles.currentBar`.
