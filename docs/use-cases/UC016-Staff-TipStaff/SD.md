# UC016 — Sequence Diagram (Clean Architecture)

```mermaid
sequenceDiagram
  actor User
  participant UI as TipButton<br/>(Component)
  participant API as /api/staff/:id/tip<br/>(API Route)
  participant Service as StaffService<br/>(Application)
  participant Repo as IStaffRepository<br/>(Domain Interface)
  participant RepoImpl as staffRepository<br/>(Infrastructure)
  participant DB as Prisma Client<br/>(Database)

  User->>UI: Open modal + submit tip
  activate UI
  UI->>API: POST /api/staff/:id/tip {amount, message?}
  activate API

  API->>Service: tipStaff(staffId, userId, amount, message?)
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
    Service->>Repo: createTip(staffId, userId, amount, message?)
    activate Repo
    Repo->>RepoImpl: createTip(...)
    activate RepoImpl
    RepoImpl->>DB: staffTip.create(...)
    activate DB
    DB-->>RepoImpl: StaffTip {id}
    deactivate DB
    RepoImpl-->>Repo: tipId
    deactivate RepoImpl
    Repo-->>Service: tipId
    deactivate Repo

    Service-->>API: {success: true, tipId}
    deactivate Service
    API-->>UI: 200 {success, tipId}
    deactivate API
    UI-->>User: Show success
  else Staff profile not found
    Service-->>API: null
    deactivate Service
    API-->>UI: 404
    deactivate API
  end

  deactivate UI
```
