# UC018 — Sequence Diagram (Clean Architecture)

```mermaid
sequenceDiagram
    actor User
    participant UI as RegisterForm<br/>(Component)
    participant API as /api/auth/register<br/>(API Route)
    participant Service as AuthService<br/>(Application)
    participant Repo as IUserRepository<br/>(Interface)
    participant RepoImpl as UserRepository<br/>(Infrastructure)
    participant DB as Prisma Client<br/>(Database)
    participant Auth as NextAuth<br/>(Session)

    User->>UI: Fill form and submit
    activate UI

    Note over UI: Client Validation
    UI->>UI: Validate with Zod schema

    UI->>API: POST /api/auth/register<br/>{name, email, password}
    activate API

    Note over API: Layer 1: Presentation
    API->>API: Parse request body
    API->>API: Validate CSRF token

    API->>Service: registerUser(dto)
    activate Service

    Note over Service: Layer 2: Application
    Service->>Service: Validate with registerSchema (Zod)

    Service->>Repo: findByEmail(email)
    activate Repo
    Repo->>RepoImpl: findByEmail(email)
    activate RepoImpl

    Note over RepoImpl: Layer 3: Infrastructure
    RepoImpl->>DB: user.findUnique({where: {email}})
    activate DB
    DB-->>RepoImpl: User | null
    deactivate DB

    alt User exists
        RepoImpl->>RepoImpl: Map to UserDto
        RepoImpl-->>Repo: UserDto
        deactivate RepoImpl
        Repo-->>Service: UserDto
        deactivate Repo

        Service-->>API: Error: EMAIL_EXISTS
        API-->>UI: 409 Conflict
        UI-->>User: "Email already registered"
        deactivate Service
        deactivate API
        deactivate UI
    else User does not exist
        RepoImpl-->>Repo: null
        deactivate RepoImpl
        Repo-->>Service: null
        deactivate Repo

        Note over Service: Business Logic
        Service->>Service: hashPassword(password)<br/>bcrypt, 10 rounds

        Service->>Repo: create(userData)
        activate Repo
        Repo->>RepoImpl: create(userData)
        activate RepoImpl

        RepoImpl->>DB: user.create({data})
        activate DB
        DB-->>RepoImpl: User (Prisma Model)
        deactivate DB

        Note over RepoImpl: Map Entity to DTO
        RepoImpl->>RepoImpl: toUserDto(user)

        RepoImpl-->>Repo: UserDto
        deactivate RepoImpl
        Repo-->>Service: UserDto
        deactivate Repo

        Note over Service: Create Session
        Service->>Auth: createSession(userDto)
        activate Auth
        Auth->>Auth: Generate JWT
        Auth-->>Service: SessionToken
        deactivate Auth

        Service-->>API: {user: UserDto, token: string}
        deactivate Service

        Note over API: Set Session Cookie
        API->>API: Set httpOnly cookie

        API-->>UI: 201 Created<br/>{user: UserDto}
        deactivate API

        UI->>UI: Redirect to /dashboard
        UI-->>User: "Account created successfully!"
        deactivate UI
    end
```

## Layer Boundaries (Clean Architecture)

### Layer 1: Presentation (`app/api/auth/register/route.ts`)

**Responsibilities**:

- Parse HTTP request
- Validate CSRF token
- Call AuthService
- Map errors to HTTP status codes
- Set session cookie
- Return HTTP response

**Dependencies**: AuthService (Application Layer)
**Knows About**: DTOs only
**Never Knows About**: Prisma, Database, Repositories

---

### Layer 2: Application (`src/services/authService.ts`)

**Responsibilities**:

- Business logic validation
- Orchestrate registration flow
- Hash password with bcrypt
- Call repository through interface
- Create session

**Dependencies**: IUserRepository (Interface in Domain Layer)
**Knows About**: DTOs, Domain Interfaces, Zod Schemas
**Never Knows About**: Prisma, Database, HTTP, UI

---

### Layer 3: Infrastructure (`src/repositories/userRepository.ts`)

**Responsibilities**:

- Database operations via Prisma
- Map Prisma models to DTOs
- Implement IUserRepository interface

**Dependencies**: Prisma Client, IUserRepository Interface
**Knows About**: Prisma Models, DTOs, Database
**Never Knows About**: HTTP, Business Logic, UI

---

### Layer 4: Domain (`src/domain/`)

#### `src/domain/interfaces/IUserRepository.ts`

```typescript
interface IUserRepository {
  findByEmail(email: string): Promise<UserDto | null>;
  create(data: CreateUserData): Promise<UserDto>;
}
```

#### `src/domain/dtos/UserDto.ts`

```typescript
type UserDto = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};
```

#### `src/domain/validations/registerSchema.ts`

```typescript
const registerSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  password: z
    .string()
    .min(8)
    .max(72)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/),
});
```

**Knows About**: NOTHING external — pure TypeScript only

---

## Dependency Flow (Inward)

```
Presentation Layer (API Route)
        ↓ depends on
Application Layer (Service)
        ↓ depends on
Domain Layer (Interfaces, DTOs)
        ↑ implements
Infrastructure Layer (Repository)
```

## Data Flow (Outward)

```
Database (Prisma Model: User)
        ↓ mapped to
Infrastructure Layer (UserDto)
        ↓ returns
Application Layer (UserDto)
        ↓ returns
Presentation Layer (UserDto)
        ↓ serializes to JSON
Client (User object)
```

## Key Principles Enforced

1. ✅ **API Route never imports `db` or Prisma**
2. ✅ **Service never imports `db` or Prisma**
3. ✅ **Service depends on IUserRepository interface, not concrete implementation**
4. ✅ **Repository always maps Prisma models to DTOs**
5. ✅ **Domain layer has zero external dependencies**
6. ✅ **DTOs cross all layer boundaries**
7. ✅ **Prisma models stay inside repositories only**
