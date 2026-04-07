# UC003 — Code-Backend-Test

## Service Tests

- `listApprovedBars()` returns all approved bars when no filters.
- `listApprovedBars({ area })` filters by area.
- `listApprovedBars({ category })` filters by category.

## Route Tests

- Invalid `area` returns 400.
- Invalid `category` returns 400.
