# UC020 — Code-UI

## Navbar

- Add `src/components/layout/Navbar.tsx`.
- Shows:
  - Logo text: "Phnom Penh By Night"
  - Links: Bars, Blog, Staff, Events
  - Auth area:
    - Logged out: Login link
    - Logged in: username + Logout button
- Logout triggers `signOut()` from `next-auth/react`.
- Mobile responsive hamburger menu.

## Layout

- Render `<Navbar />` in `src/app/layout.tsx` above `{children}`.

## Dashboard

- Add `src/app/dashboard/page.tsx`.
- Redirect to `/login` if not authenticated.
- Show placeholder: "Welcome back, {email}".
