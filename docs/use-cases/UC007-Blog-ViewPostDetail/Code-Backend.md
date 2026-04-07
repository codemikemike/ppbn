# UC007 — Code (Backend)

## Repository

- Extend `IBlogRepository` with `findBySlug(slug)`.
- Implement `blogRepository.findBySlug` including author.

## Service

- Add `getPublishedPostBySlug(slug)` which throws `NotFoundError` if missing.

## API

- Add `GET /api/blog/:slug`.
