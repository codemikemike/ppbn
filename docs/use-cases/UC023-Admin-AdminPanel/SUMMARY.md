# UC023 — Summary

UC023 introduces an Admin-only panel at `/admin/*` with:

- A shared layout with sidebar navigation.
- An overview dashboard with key counts.
- Management pages for bars, reviews, users, blog posts, and staff profiles.
- Admin API routes for approve/reject, publish/unpublish, role changes, and soft deletes.

Clean Architecture is preserved by routing all business logic through `adminService`, which uses an `IAdminRepository` implemented by `adminRepository`.
