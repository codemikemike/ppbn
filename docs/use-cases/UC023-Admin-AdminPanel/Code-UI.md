# UC023 — Code-UI

## Admin layout

- `/admin/layout.tsx` verifies admin access and renders a sidebar.

## Pages

- `/admin/page.tsx` shows overview stats.
- `/admin/bars/page.tsx` lists all bars and supports approve/reject/delete.
- `/admin/reviews/page.tsx` lists all reviews and supports approve/reject/delete.
- `/admin/users/page.tsx` lists all users and supports role change + delete.
- `/admin/blog/page.tsx` lists all blog posts and supports publish/unpublish + delete.
- `/admin/staff/page.tsx` lists all staff profiles and supports approve/reject/delete.

Mutations are performed via forms that call admin API routes.
