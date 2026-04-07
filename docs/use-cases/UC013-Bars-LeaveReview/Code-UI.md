# UC013 — Code-UI

## Components

- Add `ReviewForm` client component:
  - Shows login prompt when logged out.
  - Star rating (1–5) + comment textarea.
  - Submits to `POST /api/bars/[slug]/reviews`.
  - Shows success/error feedback and clears form on success.

## Page

- Update `/bars/[slug]` to render `ReviewForm` below the reviews list.
