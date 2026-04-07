# UC012 — Design Class Diagram (DCD)

```mermaid
classDiagram
  class RateBarResultDto {
    +number averageRating
  }

  class IBarRepository {
    +findBySlug(slug: string): Promise~BarDetailDto | null~
    +upsertRating(barId: string, userId: string, rating: number): Promise~RateBarResultDto~
  }

  class BarService {
    +rateBar(slug: string, userId: string, input: { rating: number }): Promise~RateBarResultDto | null~
  }

  class StarRating {
    +render()
  }

  BarService --> IBarRepository
  StarRating --> BarService : calls API
```
