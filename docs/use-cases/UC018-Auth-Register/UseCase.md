# UC018 — Auth — Register

## Use Case Name

User Registration

## Actor

Visitor (Unauthenticated User)

## Preconditions

- User is not authenticated
- User is on the registration page at `/register`
- User has a valid email address
- Email is not already registered in the system

## Main Flow

1. User navigates to the registration page
2. System displays registration form with fields: name, email, password, confirm password
3. User enters name
4. User enters email address
5. User enters password (minimum 8 characters)
6. User enters password confirmation
7. User clicks "Register" button
8. System validates all inputs:
   - Name is not empty
   - Email is valid format
   - Email is not already registered
   - Password meets minimum requirements (8+ characters, contains uppercase, lowercase, number)
   - Password and confirm password match
9. System hashes the password using bcrypt
10. System creates new User record with role RegisteredUser
11. System automatically logs in the new user (creates session)
12. System redirects user to `/dashboard` with success message

## Alternative Flows

### 8a. Email Already Registered

1. System detects email already exists in database
2. System displays error: "Email already registered. Please login or use a different email."
3. User returns to step 4

### 8b. Password Does Not Meet Requirements

1. System detects password does not meet requirements
2. System displays error: "Password must be at least 8 characters and contain uppercase, lowercase, and number"
3. User returns to step 5

### 8c. Passwords Do Not Match

1. System detects password and confirm password do not match
2. System displays error: "Passwords do not match"
3. User returns to step 6

### 8d. Invalid Email Format

1. System detects email is not valid format
2. System displays error: "Please enter a valid email address"
3. User returns to step 4

### 8e. Network Error During Registration

1. System encounters error while creating user record
2. System displays error: "Registration failed. Please try again."
3. User can retry from step 7

## Postconditions

### Success

- New User record created in database with:
  - Unique ID
  - Name as provided
  - Email as provided
  - Hashed password (never stored in plain text)
  - Role: RegisteredUser
  - emailVerified: null (to be verified later)
  - createdAt: current timestamp
  - updatedAt: current timestamp
  - deletedAt: null
- User is authenticated with valid session
- User is redirected to dashboard
- Success message displayed: "Account created successfully! Welcome to PPBN."

### Failure

- No User record created
- User remains unauthenticated
- User remains on registration page with error message
- Form fields retain entered values (except password fields which are cleared for security)

## Business Rules

1. Email addresses must be unique across all users (including soft-deleted)
2. Passwords must be hashed using bcrypt before storage
3. Minimum password length: 8 characters
4. Password must contain at least one uppercase letter, one lowercase letter, and one number
5. Default role for new registrations: RegisteredUser
6. User accounts start unverified (emailVerified = null)
7. Soft-deleted user emails cannot be reused
8. Registration is rate-limited to prevent abuse (5 attempts per IP per hour)

## Special Requirements

1. Form validation must occur client-side (immediate feedback) and server-side (security)
2. Password fields must use type="password" and never expose plain text
3. Registration form must be accessible (keyboard navigation, screen reader friendly)
4. Form must include CSRF protection
5. Passwords must never be logged or displayed in error messages

## Frequency of Use

High — several times per day

## Open Issues

1. Should we require email verification before allowing login? (Decision: No, allow login immediately, but require verification for certain features)
2. Should we support OAuth providers (Google, Facebook)? (Future enhancement, not MVP)
3. Should we collect additional profile information during registration? (Decision: No, keep registration minimal, collect more in profile edit later)
