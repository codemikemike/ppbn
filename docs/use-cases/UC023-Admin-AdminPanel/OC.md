# UC023 — Operation Contracts (OC)

## PATCH /api/admin/bars/:id/approve

**Preconditions**: Authenticated and role `Admin`.

**Input**: `{ approved: boolean }`

**Postconditions**: Updates `bars.isApproved` for the target bar.

**Output**:

- `200` `{ success: true }`
- `401` unauthenticated
- `403` not admin
- `404` not found
- `400` validation error

---

## DELETE /api/admin/bars/:id

**Preconditions**: Authenticated and role `Admin`.

**Postconditions**: Soft deletes the bar (`bars.deletedAt` set).

**Output**: `200` `{ success: true }` or `401/403/404`.

---

## PATCH /api/admin/reviews/:id/approve

Same structure as bar approve; updates `reviews.isApproved`.

---

## PATCH /api/admin/users/:id/role

**Input**: `{ role: UserRole }`

**Postconditions**: Updates `users.role`.

---

## DELETE /api/admin/users/:id

**Postconditions**: Soft deletes the user (`users.deletedAt` set).

---

## PATCH /api/admin/blog/:id/publish

**Input**: `{ published: boolean }`

**Postconditions**: Updates `blog_posts.isPublished` and `publishedAt`.

---

## PATCH /api/admin/staff/:id/approve

Same structure as bar approve; updates `staff_profiles.isApproved`.
