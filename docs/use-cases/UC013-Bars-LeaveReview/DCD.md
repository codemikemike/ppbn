# UC013 — Design Class Diagram (DCD)

```mermaid
classDiagram
  class UpsertReviewResultDto {
    +string id
    +number rating
    +string comment
    +Date createdAt
    +Date updatedAt
  }

  class IBarRepository {
    +findBySlug(slug: string): Promise~BarDetailDto | null~
    +upsertReview(barId: string, userId: string, rating: number, comment: string): Promise~UpsertReviewResultDto~
  }

  class BarService {
    +submitReview(slug: string, userId: string, input: { rating: number, comment: string }): Promise~UpsertReviewResultDto | null~
  }

  BarService --> IBarRepository
```
