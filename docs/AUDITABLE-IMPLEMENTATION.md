# Auditable & AuditLog Implementation

## Overview

Comprehensive auditing system following Clean Architecture principles. All changes to data are tracked with who, what, when, and why.

---

## Features Implemented

### 1. IAuditable Interface

**Location**: `src/domain/interfaces/IAuditable.ts`

Pure TypeScript interface with zero external dependencies:

```typescript
interface IAuditable {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}
```

### 2. Auditable Fields Added to Models

All models with timestamps now include:

- ✅ `createdBy: String?` — User ID who created the record
- ✅ `updatedBy: String?` — User ID who last updated the record

**Models Updated**:

- User
- Bar
- BarImage
- Review
- Comment
- BlogPost
- StaffProfile
- Event

### 3. Prisma Middleware (lib/db.ts)

#### Auto-Update `updatedAt`

Automatically sets `updatedAt` on every update operation.

#### Soft Delete Enforcement

Converts hard deletes to soft deletes for auditable models:

```typescript
// Before: db.user.delete({ where: { id } })
// After: db.user.update({ where: { id }, data: { deletedAt: new Date() } })
```

**Protected Models**:

- User, Bar, Review, Comment, BlogPost, StaffProfile, Event

Hard deletes are **never allowed** on these models. They are automatically converted to soft deletes.

### 4. AuditLog Model

**Schema**:

```prisma
model AuditLog {
  id         String      @id @default(cuid())
  userId     String?
  user       User?       @relation(...)
  action     AuditAction
  entityType String
  entityId   String
  oldValues  Json?
  newValues  Json?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime    @default(now())
}
```

**Supported Actions** (AuditAction enum):

- Created
- Updated
- SoftDeleted
- Restored
- Approved
- Rejected
- Login
- Register
- Logout

### 5. Clean Architecture Stack

#### Domain Layer (Zero Dependencies)

```
src/domain/
├── interfaces/
│   ├── IAuditable.ts
│   └── IAuditLogRepository.ts
└── dtos/
    ├── AuditAction.ts
    ├── AuditLogDto.ts
    └── CreateAuditLogData.ts
```

#### Infrastructure Layer

```
src/repositories/
└── auditLogRepository.ts  // Implements IAuditLogRepository
```

#### Application Layer

```
src/services/
└── auditLogService.ts  // Business logic
```

---

## Usage Examples

### Logging User Registration

```typescript
await auditLogService.logAction("Register", "User", user.id, user.id, {
  newValues: {
    email: user.email,
    name: user.name,
    role: user.role,
  },
});
```

### Logging User Login

```typescript
await auditLogService.logAction("Login", "User", user.id, user.id, {
  ipAddress: req.ip,
  userAgent: req.headers["user-agent"],
});
```

### Logging Bar Creation

```typescript
await auditLogService.logAction("Created", "Bar", bar.id, ownerId, {
  newValues: {
    name: bar.name,
    area: bar.area,
    category: bar.category,
  },
});
```

### Logging Bar Update with Old/New Values

```typescript
await auditLogService.logAction("Updated", "Bar", bar.id, userId, {
  oldValues: {
    name: "Old Bar Name",
    area: "Riverside",
  },
  newValues: {
    name: "New Bar Name",
    area: "BKK1",
  },
});
```

### Logging Approval

```typescript
await auditLogService.logAction("Approved", "Review", review.id, adminId, {
  newValues: {
    isApproved: true,
  },
});
```

### Logging Soft Delete

```typescript
await auditLogService.logAction("SoftDeleted", "Bar", bar.id, userId, {
  oldValues: {
    deletedAt: null,
  },
  newValues: {
    deletedAt: new Date(),
  },
});
```

### Query Audit Logs

#### Get Entity History

```typescript
const history = await auditLogService.getEntityHistory("Bar", barId);
// Returns all audit logs for this specific bar
```

#### Get User Activity

```typescript
const activity = await auditLogService.getUserActivity(userId);
// Returns all actions performed by this user
```

#### Get Action Logs

```typescript
const logins = await auditLogService.getActionLogs("Login");
// Returns all login attempts
```

#### Get Recent Activity

```typescript
const recent = await auditLogService.getRecentActivity(50);
// Returns last 50 audit log entries
```

---

## Prisma Middleware Behavior

### Before Middleware

```typescript
// This would permanently delete the user
await db.user.delete({ where: { id: "user123" } });
```

### After Middleware

```typescript
// Automatically converted to:
await db.user.update({
  where: { id: "user123" },
  data: { deletedAt: new Date() },
});
```

### Auto-Update Behavior

```typescript
// updatedAt is automatically set
await db.bar.update({
  where: { id: "bar123" },
  data: { name: "New Name" },
});
// Result: { name: "New Name", updatedAt: <current timestamp> }
```

---

## Database Migration

### Run Migration

```bash
npx prisma migrate dev --name add-auditable-fields
```

This will:

1. Add `createdBy` and `updatedBy` columns to all auditable models
2. Create the `audit_logs` table
3. Add the `AuditAction` enum

### Verify Migration

```bash
npx prisma studio
```

Check:

- All auditable models have `createdBy` and `updatedBy` fields
- `audit_logs` table exists
- Can create audit log entries

---

## Best Practices

### Always Log Important Actions

```typescript
// ✅ Good - Log user actions
await auditLogService.logAction("Created", "Bar", bar.id, userId);

// ❌ Bad - Silent action without logging
await db.bar.create({ data: barData });
```

### Include Context When Available

```typescript
// ✅ Good - Include IP and user agent for security
await auditLogService.logAction("Login", "User", userId, userId, {
  ipAddress: request.ip,
  userAgent: request.headers["user-agent"],
});

// ❌ Bad - Missing security context
await auditLogService.logAction("Login", "User", userId, userId);
```

### Log Old and New Values for Updates

```typescript
// ✅ Good - Track what changed
await auditLogService.logAction("Updated", "Bar", bar.id, userId, {
  oldValues: { isApproved: false },
  newValues: { isApproved: true },
});

// ❌ Bad - No change tracking
await auditLogService.logAction("Updated", "Bar", bar.id, userId);
```

### Don't Log Sensitive Data

```typescript
// ❌ NEVER log passwords or tokens
await auditLogService.logAction("Updated", "User", userId, adminId, {
  newValues: {
    password: "hashed...", // ❌ DON'T DO THIS
  },
});

// ✅ Good - Only log non-sensitive fields
await auditLogService.logAction("Updated", "User", userId, adminId, {
  newValues: {
    email: "new@example.com",
    role: "Admin",
  },
});
```

### Gracefully Handle Audit Failures

```typescript
// ✅ Good - Don't fail the operation if audit logging fails
try {
  const user = await createUser(data);
  await auditLogService.logAction("Created", "User", user.id, user.id);
  return user;
} catch (auditError) {
  console.error("Audit logging failed:", auditError);
  // User creation still succeeded
}

// Even better - catch only audit errors
const user = await createUser(data);
await auditLogService
  .logAction("Created", "User", user.id, user.id)
  .catch((err) => console.error("Audit logging failed:", err));
return user;
```

---

## Querying with Soft Deletes

### Include Soft-Deleted Records

```typescript
const allBars = await db.bar.findMany();
// Returns all bars including soft-deleted
```

### Exclude Soft-Deleted Records

```typescript
const activeBars = await db.bar.findMany({
  where: {
    deletedAt: null,
  },
});
// Returns only active bars
```

### Find Only Soft-Deleted Records

```typescript
const deletedBars = await db.bar.findMany({
  where: {
    deletedAt: {
      not: null,
    },
  },
});
// Returns only soft-deleted bars
```

### Restore Soft-Deleted Record

```typescript
await db.bar.update({
  where: { id: barId },
  data: { deletedAt: null },
});

// Log the restoration
await auditLogService.logAction("Restored", "Bar", barId, adminId);
```

---

## Admin Panel Integration

### View Entity History

```typescript
// GET /api/admin/audit/bar/:barId
export async function GET(
  request: Request,
  { params }: { params: { barId: string } },
) {
  const history = await auditLogService.getEntityHistory("Bar", params.barId);
  return NextResponse.json({ history });
}
```

### View User Activity

```typescript
// GET /api/admin/audit/user/:userId
export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const activity = await auditLogService.getUserActivity(params.userId);
  return NextResponse.json({ activity });
}
```

### View Recent System Activity

```typescript
// GET /api/admin/audit/recent
export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const limit = parseInt(searchParams.get("limit") || "100");

  const recent = await auditLogService.getRecentActivity(limit);
  return NextResponse.json({ recent });
}
```

---

## Security Considerations

### Audit Logs Are Append-Only

- ✅ Audit logs can be **created**
- ❌ Audit logs **cannot be updated**
- ❌ Audit logs **cannot be deleted**

### Audit Logs Are Not Soft-Deleted

- Audit logs do **not** have `deletedAt`
- They are permanent records
- Only admins should access audit logs

### IP Address Privacy

- Store IP addresses for security
- Comply with GDPR/privacy laws
- Consider IP anonymization for privacy

### User Agent Storage

- Useful for detecting suspicious activity
- Can help identify automated attacks
- Keep for security analysis

---

## Testing Audit Functionality

### Test Soft Delete

```typescript
test("soft delete prevents hard delete", async () => {
  const user = await createUser({ email: "test@example.com" });

  await db.user.delete({ where: { id: user.id } });

  const deletedUser = await db.user.findUnique({ where: { id: user.id } });
  expect(deletedUser).toBeTruthy();
  expect(deletedUser.deletedAt).toBeInstanceOf(Date);
});
```

### Test Audit Logging

```typescript
test("logs user registration", async () => {
  const user = await authService.registerUser({
    name: "Test User",
    email: "test@example.com",
    password: "TestPass123",
  });

  const auditLogs = await auditLogService.getEntityHistory("User", user.id);
  expect(auditLogs).toHaveLength(1);
  expect(auditLogs[0].action).toBe("Register");
});
```

### Test Auto-Update Timestamp

```typescript
test("auto-updates updatedAt", async () => {
  const bar = await createBar({ name: "Test Bar" });
  const originalUpdatedAt = bar.updatedAt;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await db.bar.update({
    where: { id: bar.id },
    data: { name: "Updated Bar" },
  });

  const updated = await db.bar.findUnique({ where: { id: bar.id } });
  expect(updated.updatedAt.getTime()).toBeGreaterThan(
    originalUpdatedAt.getTime(),
  );
});
```

---

## Performance Considerations

### Indexes on AuditLog

- ✅ `userId` — Fast user activity queries
- ✅ `action` — Fast action-specific queries
- ✅ `entityType` — Fast entity-type queries
- ✅ `entityId` — Fast entity history queries
- ✅ `createdAt` — Fast time-range queries

### Pagination for Large Result Sets

```typescript
// Good - Paginate large result sets
const recent = await auditLogService.getRecentActivity(50);

// Bad - Fetching all audit logs
const all = await auditLogService.getRecentActivity(1000000);
```

### Archive Old Audit Logs

Consider archiving audit logs older than 1 year to separate storage for compliance.

---

## Clean Architecture Compliance

### ✅ All Rules Followed

1. ✅ **db imported ONLY in repositories/**
2. ✅ **Prisma types ONLY in repositories/**
3. ✅ **Repositories map Prisma → DTO**
4. ✅ **Domain layer has zero external imports**
5. ✅ **Services depend on interfaces**
6. ✅ **Middleware in infrastructure layer (lib/db.ts)**

---

## Files Created

### Domain Layer

- `src/domain/interfaces/IAuditable.ts`
- `src/domain/interfaces/IAuditLogRepository.ts`
- `src/domain/dtos/AuditAction.ts`
- `src/domain/dtos/AuditLogDto.ts`
- `src/domain/dtos/CreateAuditLogData.ts`

### Infrastructure Layer

- `src/repositories/auditLogRepository.ts`
- `src/lib/db.ts` (updated with middleware)

### Application Layer

- `src/services/auditLogService.ts`
- `src/services/authService.ts` (updated with audit logging)

### Database

- `prisma/schema.prisma` (updated with auditable fields and AuditLog model)

---

**Status**: ✅ Complete and ready for migration
**Migration Command**: `npx prisma migrate dev --name add-auditable-fields`
