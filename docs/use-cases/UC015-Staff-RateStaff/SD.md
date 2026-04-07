# UC015 — Sequence Diagram (Clean Architecture)

```mermaid
sequenceDiagram
  actor User
  participant UI as StaffStarRating<br/>(Component)
  participant API as /api/staff/:id/rate<br/>(API Route)
  participant Service as StaffService<br/>(Application)
  participant Repo as IStaffRepository<br/>(Domain Interface)
  participant RepoImpl as staffRepository<br/>(Infrastructure)
  participant DB as Prisma Client<br/>(Database)

  User->>UI: Click star (1-5)
  activate UI
  UI->>API: POST /api/staff/:id/rate {rating}
  activate API

  API->>Service: rateStaff(staffId, userId, rating)
  activate Service

  Service->>Repo: findApprovedById(staffId)
  activate Repo
  Repo->>RepoImpl: findApprovedById(staffId)
  activate RepoImpl
  RepoImpl->>DB: staffProfile.findFirst(...)
  activate DB
  DB-->>RepoImpl: StaffProfile | null
  deactivate DB
  RepoImpl-->>Repo: StaffProfileDetailDto | null
  deactivate RepoImpl
  Repo-->>Service: StaffProfileDetailDto | null
  deactivate Repo

  alt Staff profile found
    Service->>Repo: upsertRating(staffId, userId, rating)
    activate Repo
    Repo->>RepoImpl: upsertRating(...)
    activate RepoImpl
    RepoImpl->>DB: staffRating.upsert(...)
    activate DB
    DB-->>RepoImpl: StaffRating
    deactivate DB

    RepoImpl->>DB: staffRating.aggregate(...)
    activate DB
    DB-->>RepoImpl: {_avg, _count}
    deactivate DB

    RepoImpl-->>Repo: {averageRating, userRating}
    deactivate RepoImpl
    Repo-->>Service: {averageRating, userRating}
    deactivate Repo

    Service-->>API: {averageRating, userRating}
    deactivate Service
    API-->>UI: 200 {averageRating, userRating}
    deactivate API
    UI-->>User: UI shows updated rating
  else Staff profile not found
    Service-->>API: null
    deactivate Service
    API-->>UI: 404
    deactivate API
  end

  deactivate UI
```
