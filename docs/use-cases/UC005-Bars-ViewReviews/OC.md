# UC005 — Operation Contracts

## Operation: listApprovedReviewsByBarSlug

### Inputs

- `slug: string`

### Preconditions

- Bar exists and is approved.

### Postconditions

- Returns only approved, not deleted reviews for the bar.
- Returns 404 if the bar does not exist.

### Output

- `ReviewDto[]`

### Errors

- NotFound (404) when bar not found.
