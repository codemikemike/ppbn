# UC009 — Summary

UC009 adds a public events listing and event detail page.

- `/events` lists upcoming/current approved events, supports filtering by type, and provides a calendar view option.
- `/events/[id]` shows event details and links to the hosting bar.
- API routes expose list and detail as JSON.
- Clean Architecture is preserved: pages/API -> services -> repositories -> db.
