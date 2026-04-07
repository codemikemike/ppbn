# UC007 — Operation Contracts

## Operation: getPublishedPostBySlug

### Inputs

- `slug: string`

### Preconditions

- Post exists and is published.

### Postconditions

- Returns the published blog post.

### Output

- `BlogPostDto`

### Errors

- NotFound (404) when post is missing or not published.
