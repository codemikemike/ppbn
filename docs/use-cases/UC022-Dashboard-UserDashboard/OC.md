# UC022 — Operation Contracts (OC)

## Operation: PATCH /api/user/profile

**Preconditions**

- User is authenticated.

**Input**

- `name: string | null`

**Validation**

- `name` may be `null` to clear.
- If provided as string, must be trimmed and within allowed length.

**Postconditions**

- User row is updated (`users.name`).
- An audit log entry is recorded (best-effort).

**Output**

- `200 OK` with updated `UserDto`.
- `400` with validation issues.
- `401` if unauthenticated.

---

## Operation: PATCH /api/user/password

**Preconditions**

- User is authenticated.

**Input**

- `currentPassword: string`
- `newPassword: string`

**Validation**

- `newPassword` must meet password policy.

**Postconditions**

- User password hash is replaced.
- Any password reset tokens are invalidated.
- An audit log entry is recorded (best-effort).

**Output**

- `200 OK` with `{ success: true }`.
- `400` with validation issues.
- `401` if unauthenticated or current password invalid.

---

## Operation: Render /dashboard (stats)

**Preconditions**

- User is authenticated.

**Postconditions**

- No data changes.

**Output**

- Dashboard rendered with counts: reviews, favorites, staff ratings.

---

## Operation: Render /dashboard/reviews

**Preconditions**

- User is authenticated.

**Postconditions**

- No data changes.

**Output**

- List of the user’s reviews with related bar info.
