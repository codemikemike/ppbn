# UC006 — Operation Contracts

## Operation: listPublishedPosts

### Inputs

- `page: number`
- `limit: number`

### Preconditions

- None.

### Postconditions

- Returns published, not-deleted blog posts for the requested page.

### Output

- `BlogPostDto[]`

### Errors

- Validation (400) if query params are invalid.
