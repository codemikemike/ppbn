# UC019 — Code-Backend

## Domain

- Add `LoginDto` in `src/domain/dtos/LoginDto.ts`.
- Add `loginSchema` in `src/domain/validations/authSchema.ts`.

## Application

- Update `AuthService.authenticateUser` to validate input via `loginSchema` and reject soft-deleted accounts.

## Presentation / API

- Add NextAuth App Router handler at `src/app/api/auth/[...nextauth]/route.ts`.
- Reuse `authOptions` from `src/lib/auth.ts` configured with Credentials provider.
