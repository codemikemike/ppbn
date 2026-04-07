# UC017 — Sequence Diagram (Clean Architecture)

```mermaid
sequenceDiagram
  actor User
  participant UI as CommentForm<br/>(Component)
  participant API as /api/blog/:slug/comments<br/>(API Route)
  participant Service as BlogService<br/>(Application)
  participant Repo as IBlogRepository<br/>(Domain Interface)
  participant RepoImpl as blogRepository<br/>(Infrastructure)
  participant DB as Prisma Client<br/>(Database)

  User->>UI: Submit comment
  activate UI
  UI->>API: POST /api/blog/:slug/comments {content}
  activate API

  API->>Service: addComment(slug, userId, content)
  activate Service

  Service->>Repo: findBySlug(slug)
  activate Repo
  Repo->>RepoImpl: findBySlug(slug)
  activate RepoImpl
  RepoImpl->>DB: blogPost.findFirst(...published...)
  activate DB
  DB-->>RepoImpl: BlogPost | null
  deactivate DB
  RepoImpl-->>Repo: BlogPostDto | null
  deactivate RepoImpl
  Repo-->>Service: BlogPostDto | null
  deactivate Repo

  alt Post found
    Service->>Repo: createComment(slug, userId, content)
    activate Repo
    Repo->>RepoImpl: createComment(...)
    activate RepoImpl
    RepoImpl->>DB: blogComment.create(...)
    activate DB
    DB-->>RepoImpl: BlogComment {id}
    deactivate DB
    RepoImpl-->>Repo: CommentDto
    deactivate RepoImpl
    Repo-->>Service: CommentDto
    deactivate Repo

    Service-->>API: CommentDto
    deactivate Service
    API-->>UI: 200 CommentDto
    deactivate API
    UI-->>User: Show success + clear form
  else Post not found
    Service-->>API: null
    deactivate Service
    API-->>UI: 404
    deactivate API
  end

  deactivate UI
```
