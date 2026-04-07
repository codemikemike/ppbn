# UC010 — Code-Backend

## Domain

- `src/domain/dtos/TonightDto.ts`
- `src/domain/dtos/EventDto.ts`
- `src/domain/interfaces/IEventRepository.ts`

## Infrastructure

- `src/repositories/eventRepository.ts`
- `src/repositories/barRepository.ts` (extended)

## Application

- `src/services/tonightService.ts`

## API

- `src/app/api/tonight/route.ts`

## Notes

- API routes call services only.
- Services depend on repository interfaces only.
- Repositories are the only layer importing `db`.
