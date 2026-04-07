# UC018 — System Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant UI as Registration Form<br/>(Presentation)
    participant API as API Route<br/>POST /api/auth/register
    participant System as System<br/>(Application + Infrastructure)

    User->>UI: 1. Navigate to /register
    activate UI
    UI-->>User: Display registration form
    deactivate UI

    User->>UI: 2. Enter name
    User->>UI: 3. Enter email
    User->>UI: 4. Enter password
    User->>UI: 5. Enter confirm password

    User->>UI: 6. Click "Create Account"
    activate UI

    Note over UI: Client-side validation
    UI->>UI: Validate name not empty
    UI->>UI: Validate email format
    UI->>UI: Validate password strength
    UI->>UI: Validate passwords match

    alt Validation Fails
        UI-->>User: Display validation errors
        deactivate UI
    else Validation Passes
        UI->>API: POST /api/auth/register<br/>{name, email, password}
        activate API

        API->>System: registerUser(name, email, password)
        activate System

        Note over System: Server-side validation
        System->>System: Validate input with Zod schema
        System->>System: Check email uniqueness

        alt Email Already Exists
            System-->>API: Error: Email already registered
            API-->>UI: 409 Conflict<br/>{error: "Email already registered"}
            UI-->>User: Show error message
            deactivate API
            deactivate System
            deactivate UI
        else Email Available
            System->>System: Hash password with bcrypt
            System->>System: Create User record<br/>(role: RegisteredUser)
            System->>System: Create auth session

            System-->>API: UserDto + Session
            deactivate System

            API-->>UI: 201 Created<br/>{user: UserDto, sessionToken}
            deactivate API

            UI->>UI: Store session
            UI->>UI: Navigate to /dashboard
            UI-->>User: Show success message<br/>"Account created successfully!"
            deactivate UI
        end
    end
```

## System Operations

### Operation 1: registerUser

**Input**: name: string, email: string, password: string  
**Output**: UserDto + Session OR Error

**Processing**:

1. Validate inputs against schema
2. Check email uniqueness in database
3. Hash password with bcrypt (10 rounds)
4. Create User entity with role RegisteredUser
5. Create authenticated session
6. Return UserDto and session token

## Data Flow

### Request Payload

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Success Response (201 Created)

```json
{
  "user": {
    "id": "clx1234567890",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "RegisteredUser",
    "emailVerified": null,
    "createdAt": "2026-04-07T13:41:16Z"
  },
  "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Response (409 Conflict)

```json
{
  "error": "Email already registered",
  "code": "EMAIL_EXISTS"
}
```

### Error Response (400 Bad Request)

```json
{
  "error": "Validation failed",
  "issues": [
    {
      "field": "password",
      "message": "Password must contain uppercase, lowercase, and number"
    }
  ]
}
```

## Notes

- Password is never sent back in response
- Session token is JWT containing user ID and role
- Client stores session token in httpOnly cookie
- All communication over HTTPS in production
