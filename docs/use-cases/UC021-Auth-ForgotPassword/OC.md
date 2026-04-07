# UC021 — Operation Contracts

## Operation 1: requestPasswordReset

### Contract: requestPasswordReset(email: string): void

**Preconditions**:

- `email` is a valid email address

**Postconditions**:

- If a user exists with the email and is not deleted:
  - A secure reset token and expiry are stored for the user
  - A reset link is generated (email sending is logged for now)
- Always returns success from the API to avoid account enumeration

## Operation 2: resetPassword

### Contract: resetPassword(token: string, newPassword: string): void

**Preconditions**:

- `token` is not empty
- `newPassword` meets password rules
- A user exists with matching reset token
- Reset token is not expired

**Postconditions**:

- User password is updated (hashed)
- Reset token and expiry are cleared (invalidated)

## Invariants

1. Reset token is time-limited
2. Token is single-use (cleared after reset)
3. Forgot-password endpoint does not reveal if email exists
