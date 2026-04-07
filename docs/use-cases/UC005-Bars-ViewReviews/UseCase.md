# UC005 — Bars — View Reviews

## Actors

- Visitor
- RegisteredUser

## Preconditions

- Bar exists and is approved.
- Reviews shown are approved and not soft-deleted.

## Trigger

- User opens a bar detail page and scrolls to the reviews section.

## Main Flow

1. System displays the bar detail page.
2. System displays the reviews section:
   - Average rating (stars)
   - Total number of reviews
   - Review list
3. For each review, system displays:
   - Reviewer name
   - Date
   - Rating (stars)
   - Comment

## Postconditions

- User can read approved reviews for the bar.

## Business Rules

- Only approved reviews are returned/displayed.
- Anonymous display when reviewer name is missing.

## Notes

- Reviews are rendered as semantic `<article>` elements.
