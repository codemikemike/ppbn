# UC002 — Code-Backend-Test

## Unit Tests (Service)

- `barService.getApprovedBarBySlug`:
  - Returns `null` when repository returns `null`.
  - Returns `BarDetailDto` when repository returns a DTO.

## Repository Tests (Optional / Integration)

- Verify `findBySlug`:
  - Filters `isApproved = true` and `deletedAt = null`.
  - Includes only approved, non-deleted reviews.
  - Selects primary image URL deterministically.

## Error Handling

- API route returns `404` when the bar is not found.
- API route returns `500` for unexpected errors.
