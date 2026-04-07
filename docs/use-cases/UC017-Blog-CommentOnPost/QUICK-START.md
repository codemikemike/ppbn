# UC017 — Quick Start

## UI

1. Navigate to `/blog/[slug]`.
2. Scroll to the comments section.
3. If logged in, write a comment (min 5 chars) and submit.

## API

List approved comments:

```bash
curl http://localhost:3000/api/blog/<slug>/comments
```

Create comment (requires an authenticated session cookie):

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"content":"Great post!"}' \
  http://localhost:3000/api/blog/<slug>/comments
```
