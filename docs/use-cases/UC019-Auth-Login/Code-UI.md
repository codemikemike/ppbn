# UC019 — Code-UI

## Page

- Add `/login` page in `src/app/login/page.tsx`.

## Behavior

- Collect email + password.
- Call `signIn("credentials", { redirect: false, email, password })`.
- On success, redirect to `/dashboard`.
- On failure, show error message.

## UI Data

- No Prisma types used in UI.
