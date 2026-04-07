# UC008 — Summary

UC008 adds a public staff directory with list and detail pages.

- `/staff` lists approved, active staff profiles and supports filtering by bar.
- `/staff/[id]` shows a staff profile with rating summary and rating comments.
- API routes provide JSON for both list and detail.
- Clean Architecture is preserved: pages/API -> services -> repositories -> db.
