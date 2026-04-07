export class DomainError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class EmailExistsError extends DomainError {
  constructor(
    message = "Email already registered. Please login or use a different email.",
  ) {
    super(message, "EMAIL_EXISTS", 409);
  }
}

export class ValidationError extends DomainError {
  constructor(
    message: string,
    public issues: Array<{ field: string; message: string }>,
  ) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401);
  }
}

export class NotFoundError extends DomainError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND", 404);
  }
}
