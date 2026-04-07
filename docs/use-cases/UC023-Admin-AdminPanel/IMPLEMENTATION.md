# UC023 — Implementation Notes

## Access control

- `/admin/*` is protected in `src/app/admin/layout.tsx` using server-side session lookup.
- All admin API routes also enforce admin role checks and return `403` when not admin.

## Soft delete

- Deletes in UC023 are implemented as soft deletes by setting `deletedAt`.

## API inputs

- Approve routes accept `{ approved: boolean }`.
- Publish route accepts `{ published: boolean }`.
- Role route accepts `{ role: UserRole }`.

## Layering

Presentation (pages/routes) → Application (`adminService`) → Infrastructure (`adminRepository`) → Prisma.
