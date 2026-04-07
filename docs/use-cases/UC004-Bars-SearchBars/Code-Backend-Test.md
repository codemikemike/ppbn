# UC004 — Code-Backend-Test

## Service

- `listApprovedBars({ search: "rose" })` delegates filters to repository.
- Empty/whitespace search is treated as omitted.

## Repository

- Search matches by name.
- Search matches by description.
- Search combines with area/category filters.
