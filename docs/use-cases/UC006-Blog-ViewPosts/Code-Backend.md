# UC006 — Code (Backend)

## Domain

- Add `BlogPostDto`.
- Add `IBlogRepository`.

## Repository

- Implement `blogRepository.findAllPublished({ page, limit })`.
- Map Prisma BlogPost to BlogPostDto.

## Service

- Implement `blogService.listPublishedPosts(page, limit)`.

## API

- Implement `GET /api/blog?page=&limit=`.
