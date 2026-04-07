# UC017 — Blog — Comment on Post

## Use Case Name

Comment on Post

## Actor

RegisteredUser (Authenticated)

## Preconditions

- User is authenticated
- User is viewing a published blog post at `/blog/[slug]`
- The blog post exists, is published, and not soft-deleted

## Main Flow

1. User navigates to a published blog post page
2. System displays the blog content
3. System displays a list of approved comments for the post
4. System displays a comment form for authenticated users
5. User enters a comment (minimum 5 characters)
6. User submits the comment
7. System validates the request
8. System creates a new blog comment record (pending approval)
9. System returns success
10. System shows a success message and clears the form

## Alternative Flows

### 4a. User Not Authenticated

1. System shows "Login to comment"
2. System does not allow submission

### 7a. Validation Error

1. System rejects comments shorter than 5 characters
2. System returns `400 Bad Request`
3. System shows an error message

### 3a. Blog Post Not Found / Not Published

1. System cannot find a published blog post for the slug
2. System returns `404 Not Found`

### 6a. Network / Server Error

1. System fails to create the comment
2. System returns `500 Internal Server Error`
3. System shows a generic error message

## Postconditions

### Success

- A new blog comment record exists linked to `(post, user)`
- The comment is created as not approved (pending moderation)

### Failure

- No data is changed
- UI displays an error and allows retry

## Business Rules

1. Commenting requires authentication
2. Only published, not-deleted posts can be commented on
3. Comment content must be at least 5 characters
4. Only approved comments are displayed publicly

## Special Requirements

1. `GET /api/blog/:slug/comments` lists approved comments
2. `POST /api/blog/:slug/comments` requires authentication and creates a comment
3. Clean Architecture boundaries must be respected (API → Service → Repository → DB)
4. Comment UI uses semantic HTML: each comment is an `<article>` with a `<time>`

## Frequency of Use

High — common interaction pattern

## Open Issues

1. Moderation workflow is out of scope for this UC.
