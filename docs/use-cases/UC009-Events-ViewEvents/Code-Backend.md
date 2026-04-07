# UC009 — Code-Backend

## Domain

- `src/domain/dtos/EventDto.ts`
- `src/domain/interfaces/IEventRepository.ts`

## Infrastructure

- `src/repositories/eventRepository.ts`
  - `findUpcoming(filters)`
  - `findUpcomingById(id)`

## Application

- `src/services/eventService.ts`
  - `listUpcomingEvents(filters)`
  - `getUpcomingEventById(id)`

## API

- `src/app/api/events/route.ts`
  - `GET /api/events?type=&barId=`
- `src/app/api/events/[id]/route.ts`
  - `GET /api/events/:id`

## Notes

- API routes call services only.
- Services depend on repository interfaces only.
- Repositories are the only layer importing `db`.
