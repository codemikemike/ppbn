# UC019 — Operation Contract (OC)

## Operation

Login via NextAuth Credentials provider

## Inputs

- `email: string`
- `password: string`

## Output (Success)

- Authenticated session established (JWT)
- Redirect to `/dashboard`

## Output (Failure)

- No session
- Error shown on `/login`

## Preconditions

- User is not authenticated

## Postconditions

- No database writes are required for authentication.
- Optionally, an audit log entry is created for successful login.

## Business Rules Enforced

- Soft-deleted users cannot log in
- Password verification via bcrypt
- Generic error message for invalid credentials
