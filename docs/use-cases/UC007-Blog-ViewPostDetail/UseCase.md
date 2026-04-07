# UC007 — Blog — View Post Detail

## Actors

- Visitor
- RegisteredUser

## Preconditions

- Blog post exists.
- Blog post is published and not soft-deleted.

## Trigger

- User navigates to `/blog/[slug]`.

## Main Flow

1. User opens a blog post detail page.
2. System loads the published post by slug.
3. System displays:
   - Title
   - Author
   - Published date
   - Category
   - Tags
   - Featured image
   - Full content
4. System loads related posts (same category, max 3) and displays them in an aside.

## Postconditions

- User can read the full content of a published blog post.

## Business Rules

- Only `isPublished = true`, `publishedAt != null`, and `deletedAt = null` posts are visible.
- Related posts are published, not deleted, and share the same category.
