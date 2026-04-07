# PPBN — Project Notepad & Copilot Instructions

## Project Overview
Phnom Penh By Night (PPBN) is a nightlife discovery platform for bars, venues, and nightlife professionals in Phnom Penh, Cambodia.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript (strict mode, no any)
- Tailwind CSS + shadcn/ui
- Prisma ORM + MySQL
- NextAuth.js (authentication)
- Zod (validation)
- React Query (TanStack Query) for data fetching
- Cloudinary (image upload and optimization)
- next-intl (internationalisation)
- Pino (logging)
- Jest + React Testing Library + Playwright (testing)
- ESLint + Prettier + Husky + lint-staged (code quality)

## Hosting & Deployment
- Hostinger Business Plan (Managed Node.js)
- MySQL database on Hostinger
- Cloudinary for image storage and CDN
- GitHub for version control and CI/CD

## Language
All code, comments, documentation, and commit messages must be written in English.

## Documentation
All documentation must be written in Markdown (.md) files.

---

## Clean Architecture — Layer Rules

This is the most important section. Every layer has strict boundaries.
Violating these rules is never acceptable regardless of convenience.

PRESENTATION LAYER — app/ components/ hooks/
- Knows about: DTOs only
- NEVER knows about: domain entities, db, Prisma

APPLICATION LAYER — services/
- Knows about: interfaces, DTOs
- NEVER knows about: db, Prisma, HTTP, UI

INFRASTRUCTURE LAYER — repositories/ lib/db.ts
- Knows about: interfaces, Prisma, DTOs
- NEVER knows about: HTTP, UI, services

DOMAIN LAYER — domain/interfaces domain/dtos domain/validations domain/errors
- Knows about: NOTHING external
- Pure TypeScript only — zero imports

---

## The Golden Rules — Read Before Writing Any Code

RULE 1: NOTHING talks to the database directly except repositories

// VIOLATION — API route importing db
import { db } from "@/lib/db" // in app/api/bars/route.ts — NEVER

// VIOLATION — Service importing db
import { db } from "@/lib/db" // in services/barService.ts — NEVER

// CORRECT — API route calls service only
import { barService } from "@/services/barService"
export async function GET() {
  const bars = await barService.getBars()
  return NextResponse.json(bars)
}

// CORRECT — Only repository imports db
import { db } from "@/lib/db" // only in repositories/ — always correct here

RULE 2: NOTHING imports Prisma types outside repositories

// VIOLATION
import type { Bar } from "@prisma/client" // NEVER outside repositories/

// CORRECT
import type { BarDto } from "@/domain/dtos/BarDto"

RULE 3: Repositories always map Prisma models to DTOs before returning

// VIOLATION
findAll: () => db.bar.findMany() // returns Prisma Bar — NEVER

// CORRECT
findAll: async () => {
  const bars = await db.bar.findMany()
  return bars.map(toBarDto)
}

RULE 4: Dependency direction always points inward
Presentation -> Application -> Infrastructure -> Domain

---

## Folder Structure

src/
├── app/                          Presentation Layer
│   ├── (auth)/                   Login and register pages
│   ├── bars/                     Bar pages
│   ├── blog/                     Blog pages
│   ├── staff/                    Staff pages
│   ├── events/                   Events page
│   ├── tonight/                  Tonight page
│   ├── dashboard/                Dashboard — login required
│   ├── admin/                    Admin panel — admin role required
│   └── api/                      API endpoints — calls services ONLY
│
├── components/                   Presentation Layer — UI only, uses DTOs
│   ├── ui/                       shadcn/ui (do not modify)
│   ├── shared/
│   ├── bars/
│   ├── blog/
│   ├── staff/
│   └── events/
│
├── hooks/                        Custom React hooks
│
├── services/                     Application Layer — business logic
│   ├── barService.ts
│   ├── reviewService.ts
│   ├── blogService.ts
│   ├── staffService.ts
│   └── authService.ts
│
├── repositories/                 Infrastructure Layer — ONLY place db is used
│   ├── barRepository.ts
│   ├── reviewRepository.ts
│   ├── blogRepository.ts
│   └── staffRepository.ts
│
├── domain/                       Domain Layer — pure TypeScript, ZERO external imports
│   ├── interfaces/               Repository contracts
│   ├── dtos/                     Data Transfer Objects
│   ├── validations/              Zod schemas
│   ├── errors/                   Domain error classes
│   └── constants/
│
└── lib/
    ├── db.ts                     Prisma singleton — ONLY imported by repositories/
    ├── auth.ts                   NextAuth config
    ├── cloudinary.ts
    └── utils.ts

---

## User Roles & Access Control

| Role | Description |
|---|---|
| Visitor | No login required — read only |
| RegisteredUser | Login required — can rate, review, comment, save favorites |
| BarOwner | Login required — can manage own bars and events |
| BlogWriter | Login required — can create and edit blog posts |
| Staff | Login required — has staff profile with ratings and tips |
| Admin | Full access — manages all content and users |

---

## Route Structure

### Public Routes
/                     Homepage
/bars                 Bar listing
/bars/[slug]          Bar detail
/blog                 Blog listing
/blog/[slug]          Blog post
/staff                Staff listing
/staff/[slug]         Staff profile
/events               Events calendar
/tonight              Tonight in Phnom Penh
/login                Login page
/register             Register page

### Dashboard Routes — login required
/dashboard                      Overview
/dashboard/bars                 My bars (BarOwner)
/dashboard/bars/new             Create bar
/dashboard/bars/[slug]/edit     Edit bar
/dashboard/blog                 My blog posts (BlogWriter)
/dashboard/blog/new             Create post
/dashboard/blog/[slug]/edit     Edit post
/dashboard/staff                My staff profile
/dashboard/profile              My profile and settings
/dashboard/events               My events

### Admin Routes — Admin role required
/admin                    Admin overview
/admin/bars               Approve / reject bars
/admin/users              Manage users and roles
/admin/reviews            Moderate reviews and comments
/admin/blog               Manage all blog posts
/admin/staff              Manage staff profiles
/admin/events             Manage events

---

## Authentication Architecture

### NextAuth.js Setup
- Provider: Credentials (email + password)
- Future providers: Google, Facebook
- Session strategy: JWT
- Session includes: id, email, role, name

### Middleware — Route Protection
// middleware.ts
import { withAuth } from "next-auth/middleware"
export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      const path = req.nextUrl.pathname
      if (path.startsWith("/admin")) return token?.role === "Admin"
      if (path.startsWith("/dashboard")) return !!token
      return true
    },
  },
})
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}

### Role Check Pattern
const session = await getServerSession(authOptions)
if (!session) redirect("/login")
if (session.user.role !== "Admin") redirect("/")

---

## Architecture Principles

### SOLID
- S: Every file has ONE responsibility
- O: Extend via new files and composition — never modify working code
- L: All IRepository implementations must honor the interface contract fully
- I: Keep interfaces small — IBarRepository only has bar methods
- D: Services depend on IRepository interfaces, not concrete repositories

### GOF Patterns
- Singleton: Prisma client in lib/db.ts
- Repository: Database access behind IRepository interfaces
- Strategy: Sorting/filtering as interchangeable functions
- Observer: React Query for server state
- Factory: createBarService(repo) for testable, injectable services

### Other Principles
- Composition over Inheritance
- DRY — shared logic in hooks/ or lib/utils.ts
- KISS — no over-engineering
- YAGNI — build what is needed now

---

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | BarCard.tsx |
| Hooks | camelCase + use | useBarFilters.ts |
| Services | camelCase + Service | barService.ts |
| Repositories | camelCase + Repository | barRepository.ts |
| Interfaces | PascalCase + I prefix | IBarRepository.ts |
| DTOs | PascalCase + Dto | BarDto.ts |
| Zod schemas | camelCase + Schema | barSchema.ts |
| Mappers | camelCase + to prefix | toBarDto |
| API routes | kebab-case | /api/bars |

---

## Domain Language

| Term | Definition |
|---|---|
| Bar | A nightlife venue |
| Area | Location zone (Riverside, BKK1, Street 136, Street 104) |
| Category | Type of bar (Cocktail Bar, Rooftop Bar, Club, Sports Bar) |
| StaffProfile | Bar staff member with ratings and tips |
| Review | Written review with star rating |
| Event | Nightlife event (DJ night, Ladies Night, etc.) |
| Featured | Promoted or paid listing |
| Slug | URL-friendly name (rose-bar, martini-bar) |
| DTO | Data Transfer Object — crosses layer boundaries |
| Entity | Prisma model — stays inside repositories only |

---

## Code Style

- Always use TypeScript strict mode — no any
- const over let
- Arrow functions for components and handlers
- Always destructure props
- Early returns over nested if statements
- Max 150 lines per component — split if larger
- Custom hooks for complex logic
- No console.log — use Pino
- No commented out code — use Git history
- No magic numbers — use named constants
- Always handle loading and error states

---

## SEO Rules

- Every page has unique title and description via Next.js Metadata API
- Bar pages include Schema.org JSON-LD (LocalBusiness)
- Blog posts include Schema.org JSON-LD (Article)
- All images have alt text
- Use next/image — never img tag
- Use next-sitemap for sitemap.xml

---

## Images & Placeholders

- Always next/image — never img tag
- Fallback to /public/images/placeholders/[type]-placeholder.webp
- Never show broken images or empty boxes
- Max 200KB per image, always WEBP
- Placeholder types: bar, staff, blog, event

---

## Performance Rules

- React Server Components by default
- use client only when needed
- Suspense boundaries for async components
- ISR: export const revalidate = 3600
- Lighthouse score above 90
- First load under 3 seconds

---

## Security Rules

- Zod validation on all API inputs
- No secrets in client components
- Environment variables for all keys
- Rate limit auth endpoints
- CORS locked to production domain
- CSRF protection via NextAuth

---

## Environment Variables

- .env.local — local, never commit
- .env.example — commit with empty values
- .env.production — server only
- Never hardcode keys or URLs
- Client variables prefixed with NEXT_PUBLIC_

---

## Git Discipline

Commit convention:
- feat: add bar rating system
- fix: correct star rating calculation
- chore: update dependencies
- refactor: split BarList into smaller components
- docs: update README
- test: add unit tests for barService
- style: format with prettier

Branch strategy:
- Never commit to main directly
- One branch per feature: feature/bar-ratings
- Pull Request required before merge

---

## Testing Strategy

- Unit tests: services/ — mock IRepository interface, never db
- Component tests: components/ — use DTOs as props
- E2E tests: login, create bar, write review
- Test behavior not implementation
- Mock IBarRepository in service tests — never mock db
- One test file per module: barService.test.ts

---

## Accessibility

- Descriptive alt text on all images
- Semantic HTML: nav, main, article, section
- Descriptive button text
- Labels on all form inputs
- Colour contrast minimum 4.5:1
- Full keyboard navigation

---

## i18n

Using next-intl — no hardcoded strings in components.
Always use translation keys: const t = useTranslations("bars")

---

## Use Case Artifact Template

Every feature must be documented before code is written.
When asked to implement a use case, generate ALL artifacts in order.

### Artifact Order
1. UseCase         — actors, preconditions, main flow, postconditions
2. UserFlowDiagram — Mermaid flowchart of user journey
3. Wireframe       — Mermaid or ASCII layout of UI
4. DM              — Domain Model (Mermaid class diagram)
5. SSD             — System Sequence Diagram (Mermaid)
6. OC              — Operation Contract (pre/post per operation)
7. SD              — Sequence Diagram between layers (Mermaid)
8. DCD             — Design Class Diagram (Mermaid)
9. ERD             — Entity Relationship Diagram (Mermaid)
10. Code-SQL       — migrations, views, audit log
11. Code-Backend   — interfaces, DTOs, repositories, services, API routes
12. Code-Backend-Test
13. Code-UI        — components, hooks, pages
14. Code-UI-Test

### Use Case Numbering

#### Public
UC001  Bars — List all bars
UC002  Bars — View bar detail
UC003  Bars — Filter by area and category
UC004  Bars — Search bars
UC005  Bars — View featured bars
UC006  Bars — View trending bars
UC007  Reviews — Submit review (RegisteredUser)
UC008  Reviews — View reviews
UC009  Staff — List staff
UC010  Staff — View staff profile
UC011  Staff — Rate staff (RegisteredUser)
UC012  Staff — Send tip (RegisteredUser)
UC013  Blog — List posts
UC014  Blog — View post
UC015  Events — List events
UC016  Events — View tonight
UC017  Map — View bars on map

#### Auth
UC018  Auth — Register
UC019  Auth — Login
UC020  Auth — Logout
UC021  Auth — Forgot password

#### Dashboard
UC022  Dashboard — View overview
UC023  Dashboard — Create bar (BarOwner)
UC024  Dashboard — Edit bar (BarOwner)
UC025  Dashboard — Create event (BarOwner)
UC026  Dashboard — View bar analytics (BarOwner)
UC027  Dashboard — Create blog post (BlogWriter)
UC028  Dashboard — Edit blog post (BlogWriter)
UC029  Dashboard — Manage staff profile (Staff)
UC030  Dashboard — Save favourite bars (RegisteredUser)
UC031  Dashboard — View my reviews (RegisteredUser)

#### Admin
UC032  Admin — View dashboard overview
UC033  Admin — Approve / reject bars
UC034  Admin — Manage users and roles
UC035  Admin — Moderate reviews and comments
UC036  Admin — Manage blog posts
UC037  Admin — Manage featured listings
UC038  Admin — View site analytics

---

## Documentation Requirements

Every Use Case must have ALL artifacts before code is written.
This is non-negotiable. Code without documentation is a violation.

### Validation — are we building the right thing?
- Every UseCase must be validated against the project spec before implementation
- Wireframes must be reviewed before UI is built
- Domain Model must match the ERD before any migration is created
- Use Cases must cover all user roles that interact with the feature

### Verification — are we building it right?
- Every layer boundary must be verified against Clean Architecture rules
- Every repository must be verified to return DTOs — never Prisma models
- Every API route must be verified to call services only
- Every service must be verified to use IRepository interfaces only
- Tests must verify behavior described in Operation Contracts

### Architecture Decision Records (ADR)
Every significant technical decision must be documented in docs/decisions/.

ADR Template:
# ADR001 — Title
## Status: Accepted
## Context: Why we needed to make a decision
## Decision: What we decided
## Reasons: Why we decided this
## Consequences: What this means going forward

### Definition of Done
A feature is ONLY done when ALL of these are true:
- Use Case artifacts written (UseCase, SSD, SD, DCD, ERD)
- Operation Contracts written for all service operations
- Code follows Clean Architecture — verified by ESLint boundaries
- All layers verified: API -> Service -> Repository -> DTO
- Unit tests written and passing for service layer
- Component tests written and passing
- E2E test written for critical path
- No console.log in code
- No any types in TypeScript
- Lighthouse score above 90
- PR checklist completed
- README updated if needed
- ADR written if a significant decision was made

---

## Pull Request Checklist

## What does this PR change?
## Use Case: UC###

## Checklist
- [ ] No any types
- [ ] Zod validation on all API inputs
- [ ] API routes call services only — never db or repositories
- [ ] Services call IRepository interfaces — never db directly
- [ ] Repositories return DTOs — never raw Prisma models
- [ ] Components use DTOs — never Prisma types or domain entities
- [ ] Error handling in all async functions
- [ ] No hardcoded secrets or URLs
- [ ] Components under 150 lines
- [ ] Tests added or updated
- [ ] No console.log in code
- [ ] Lighthouse above 90
- [ ] Images use next/image with alt text
- [ ] Screenshots included for UI changes
- [ ] ADR written if significant decision was made

---

## What NOT to Do

- Never use any in TypeScript
- Never use img tag — always next/image
- Never import db or Prisma outside repositories/
- Never import Prisma types outside repositories/
- Never return raw Prisma models — always map to DTO first
- Never put db calls in API routes — use services
- Never put db calls in services — use repositories
- Never put db calls in components — ever
- Never store passwords in plain text
- Never commit .env files
- Never use inline styles — use Tailwind
- Never create components over 150 lines
- Never skip Zod validation on API routes
- Never use emoji in code strings — use icon components
- Never commit directly to main
- Never leave console.log in production code
- Never copy-paste business logic — extract to service
- Never hard delete user content — use soft delete
- Never write code before writing Use Case artifacts
