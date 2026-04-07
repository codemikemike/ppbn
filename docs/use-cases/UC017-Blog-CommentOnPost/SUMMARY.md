# UC017 — Summary

- Adds comment submission for logged-in users on published blog posts.
- Displays approved comments below blog content.
- Uses semantic HTML for comments (`<article>` + `<time>`).
- API: `GET/POST /api/blog/:slug/comments`.
- Clean Architecture enforced: API → service → repository → Prisma.
