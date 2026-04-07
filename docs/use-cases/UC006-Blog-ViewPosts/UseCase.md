# UC006 — Blog — View Posts

## Actors

- Visitor
- RegisteredUser

## Preconditions

- Blog posts exist in the system.
- Only published (and not soft-deleted) posts are visible.

## Trigger

- User navigates to `/blog`.

## Main Flow

1. User opens the blog listing page.
2. System loads published posts for the requested page.
3. System displays a list of posts.
4. For each post, system shows: title, excerpt, author, date, category.
5. User selects a post.
6. System navigates to `/blog/[slug]`.

## Postconditions

- User can browse published blog posts.

## Business Rules

- Only `isPublished = true` and `publishedAt != null` posts are shown.
- Soft-deleted posts are excluded.
- Pagination is controlled by `page` query param.
