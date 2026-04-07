# UC001 — Code-Backend-Test

## Goal

Verify that the service returns only approved and non-deleted bars and applies default sorting.

## Approach

- Unit test `barService.listApprovedBars()` by mocking `IBarRepository`.
- Verify:
  - it calls `findApproved()`
  - it returns repository results unchanged

## Note

This repository currently does not include a configured unit test runner. Add Jest (or the project’s chosen runner) before implementing these tests.
