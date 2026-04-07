# PPBN — Phnom Penh By Night

Nightlife discovery platform for bars, venues, and nightlife professionals in Phnom Penh, Cambodia.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + MySQL
- NextAuth.js
- Zod
- React Query

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8.x

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env.local
# Fill in your values
```

### Database

```bash
npx prisma migrate dev
npx prisma db seed
```

### Run

```bash
npm run dev
```

Open http://localhost:3000

## Architecture

See docs/NOTEPAD.md for full architecture documentation.

## License

MIT
