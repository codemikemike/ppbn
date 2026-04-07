# UC005 — Code (Backend)

## Domain

- Add `ReviewDto` for the public review payload.

## Repository

- Reuse `barRepository.findBySlug` which already includes approved reviews.
- Ensure mapping includes reviewer name, createdAt, rating, content.

## Service

- Add `listApprovedReviewsByBarSlug(slug)` to return `ReviewDto[]`.

## API

- Add `GET /api/bars/:slug/reviews` route.
