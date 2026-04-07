# UC017 — Operation Contracts

## Operation 1: getComments

### Contract: getComments(slug: string): CommentDto[]

**Preconditions**:

- `slug` is not null or empty
- A published, not-deleted BlogPost exists with `slug = slug`

**Postconditions**:

- Returns all approved comments for the post, ordered newest-first
- No data is modified

## Operation 2: addComment

### Contract: addComment(slug: string, userId: string, content: string): CommentDto

**Preconditions**:

- `slug` is not null or empty
- `userId` is not null or empty
- `content` length is at least 5 characters after trimming
- The user is authenticated
- A published, not-deleted BlogPost exists with `slug = slug`

**Postconditions**:

- A new BlogComment row exists linked to the blog post and user
- New comment is created as `isApproved = false`
- Returns the created comment

## Invariants

1. Only approved comments are returned by the public listing
2. Comment content minimum length is 5
3. Comment creation requires authentication
