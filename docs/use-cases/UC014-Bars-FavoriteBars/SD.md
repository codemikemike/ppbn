# UC014 — Sequence Diagram (Clean Architecture)

```mermaid
sequenceDiagram
  actor User
  participant UI as FavoriteButton<br/>(Component)
  participant API as /api/bars/:slug/favorite<br/>(API Route)
  participant Service as BarService<br/>(Application)
  participant Repo as IBarRepository<br/>(Domain Interface)
  participant RepoImpl as barRepository<br/>(Infrastructure)
  participant DB as Prisma Client<br/>(Database)

  User->>UI: Click heart icon
  activate UI
  UI->>UI: Optimistic toggle
  UI->>API: POST /api/bars/:slug/favorite
  activate API

  API->>Service: toggleFavorite(slug, userId)
  activate Service

  Service->>Repo: findBySlug(slug)
  activate Repo
  Repo->>RepoImpl: findBySlug(slug)
  activate RepoImpl
  RepoImpl->>DB: bar.findFirst(...)
  activate DB
  DB-->>RepoImpl: Bar + relations
  deactivate DB
  RepoImpl-->>Repo: BarDetailDto | null
  deactivate RepoImpl
  Repo-->>Service: BarDetailDto | null
  deactivate Repo

  alt Bar found
    Service->>Repo: toggleFavorite(barId, userId)
    activate Repo
    Repo->>RepoImpl: toggleFavorite(barId, userId)
    activate RepoImpl
    RepoImpl->>DB: favoriteBar.findUnique(...)
    activate DB
    DB-->>RepoImpl: FavoriteBar | null
    deactivate DB

    alt Exists
      RepoImpl->>DB: favoriteBar.delete(...)
      activate DB
      DB-->>RepoImpl: Deleted
      deactivate DB
      RepoImpl-->>Repo: {isFavorited:false}
    else Not exists
      RepoImpl->>DB: favoriteBar.create(...)
      activate DB
      DB-->>RepoImpl: Created
      deactivate DB
      RepoImpl-->>Repo: {isFavorited:true}
    end

    deactivate RepoImpl
    Repo-->>Service: {isFavorited}
    deactivate Repo

    Service-->>API: {isFavorited}
    deactivate Service
    API-->>UI: 200 {isFavorited}
    deactivate API
    UI-->>User: Heart icon updated
  else Bar not found
    Service-->>API: null
    deactivate Service
    API-->>UI: 404
    deactivate API
    UI-->>User: No change
  end

  deactivate UI
```
