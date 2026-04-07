# UC017 — Implementation Notes

## Scope

- Allow authenticated users to submit comments on published blog posts.
- Only approved comments are shown publicly.

## API

- `GET /api/blog/:slug/comments` returns approved comments
- `POST /api/blog/:slug/comments` creates a comment (auth required)

## Validation

- `content` is trimmed
- Minimum length: 5 characters

## Architecture

- UI calls API route only
- API route calls `blogService.getComments(...)` / `blogService.addComment(...)`
- Service enforces post visibility (published + not deleted)
- Repository performs Prisma reads/writes and maps to DTOs

## Data

- New table: `blog_comments`
- Fields: `id`, `blogPostId`, `userId`, `content`, `isApproved`, timestamps

## Files

- Domain:
  - DTO: `src/domain/dtos/CommentDto.ts`
  - Repository contract: add comment methods to `src/domain/interfaces/IBlogRepository.ts`
  - Validation: `src/domain/validations/blogSchema.ts`
- Infrastructure:
  - `src/repositories/blogRepository.ts`
- Application:
  - `src/services/blogService.ts`
- API:
  - `src/app/api/blog/[slug]/comments/route.ts`
- UI:
  - `src/components/blog/CommentList.tsx`
  - `src/components/blog/CommentForm.tsx`
  - `src/app/blog/[slug]/page.tsx` integrates both
