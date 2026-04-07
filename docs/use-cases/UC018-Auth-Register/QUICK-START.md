# UC018 — Quick Start Guide

## ⚡ Get Started in 3 Steps

### 1️⃣ Create Database Migration

```bash
npx prisma migrate dev --name add_users_table
```

### 2️⃣ Set Environment Variables

Create `.env.local`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/ppbn"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3️⃣ Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000/register**

---

## 🧪 Test the API

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Expected Response (201 Created):**

```json
{
  "user": {
    "id": "clx...",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "RegisteredUser",
    ...
  },
  "message": "Account created successfully! Welcome to PPBN."
}
```

---

## 📋 Test Cases

### ✅ Success Case

- Name: "Test User"
- Email: "test@example.com"
- Password: "TestPass123"
- Expected: 201 Created, redirect to /login

### ❌ Email Already Exists

- Use same email twice
- Expected: 409 Conflict

### ❌ Weak Password

- Password: "weak"
- Expected: 400 Bad Request with validation errors

### ❌ Passwords Don't Match

- Password: "TestPass123"
- Confirm: "TestPass456"
- Expected: Client-side validation error

---

## 🏗️ Architecture at a Glance

```
User submits form
        ↓
RegisterPage (UI Component)
        ↓
POST /api/auth/register (API Route)
        ↓
authService.registerUser() (Business Logic)
        ↓
IUserRepository (Interface)
        ↓
userRepository (Implementation)
        ↓
Prisma Client
        ↓
MySQL Database
```

**Key Rule**: Each layer only talks to the layer below via interfaces.

---

## 🔍 Debug Checklist

If something doesn't work:

1. **Database Connection**

   ```bash
   npx prisma studio
   ```

   Should open Prisma Studio at http://localhost:5555

2. **TypeScript Compilation**

   ```bash
   npx tsc --noEmit
   ```

   Should show 0 errors

3. **Check Logs**
   - Look for errors in terminal where `npm run dev` is running
   - Check browser console (F12)

4. **Verify Environment Variables**

   ```bash
   echo $DATABASE_URL
   ```

5. **Check Database**
   ```bash
   npx prisma db pull
   ```

---

## 📖 Full Documentation

See `/docs/use-cases/UC018-Auth-Register/` for:

- UseCase.md — Complete specification
- SD.md — Sequence diagram
- DCD.md — Class diagram
- SUMMARY.md — Implementation details

---

## 🎯 What's Next?

After successful registration:

1. Implement UC019 — Login
2. Add unit tests for authService
3. Add E2E tests with Playwright
4. Add rate limiting
5. Set up email verification

---

**Need Help?**
Check SUMMARY.md for detailed troubleshooting and architecture explanation.
