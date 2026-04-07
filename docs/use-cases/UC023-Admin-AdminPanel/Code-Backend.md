# UC023 — Code-Backend

## New domain artifacts

- DTOs for admin overview stats and list rows.
- `IAdminRepository` interface.
- Zod schemas for admin mutation inputs.

## New infrastructure

- `adminRepository` implements `IAdminRepository` and performs Prisma queries.

## New application

- `adminService` exposes all admin operations through one service.

## New API routes

- PATCH approve/publish/role endpoints.
- DELETE endpoints for bar and user.

All admin route handlers enforce:

- Session exists
- Session role is `Admin` (else `403`)
