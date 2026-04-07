# UC016 — Implementation Notes

## Scope

- Record a tip intent for a staff profile.
- No payment processing is implemented in this UC.

## API

- `POST /api/staff/:id/tip`
- Auth required (NextAuth session)
- Body: `{ amount: number, message?: string }`
- Validation: `amount` min 1, max 100
- Response: `{ success: boolean, tipId: string }`

## Architecture

- UI calls API route only
- API route calls `staffService.tipStaff(...)`
- Service validates staff profile visibility using `findApprovedById`
- Repository creates a `StaffTip` row via Prisma

## Data

- Table: `staff_tips`
- Key fields:
  - `staffProfileId`
  - `userId`
  - `amount` (Decimal)
  - `currency` (default `USD`)
  - `message` (optional)
  - `createdAt`

## Files

- Domain:
  - DTO: `TipStaffResultDto`
  - Validation: `tipStaffSchema`
  - Interface: add `createTip` to `IStaffRepository`
- Infrastructure:
  - `staffRepository.createTip(...)`
- Application:
  - `staffService.tipStaff(...)`
- API:
  - `src/app/api/staff/[id]/tip/route.ts`
- UI:
  - `src/components/staff/TipButton.tsx`
  - `src/app/staff/[id]/page.tsx` integrates `TipButton`
