/**
 * Custom error classes for consistent error handling
 */

class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details = null) {
    super(message, 400, 'BAD_REQUEST');
    this.details = details;
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409, 'CONFLICT');
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
  }
}

// Helper functions to throw errors
const badRequest = (message, details) => {
  throw new BadRequestError(message, details);
};

const unauthorized = (message) => {
  throw new UnauthorizedError(message);
};

const forbidden = (message) => {
  throw new ForbiddenError(message);
};

const notFound = (message) => {
  throw new NotFoundError(message);
};

const conflict = (message) => {
  throw new ConflictError(message);
};

const internalError = (message) => {
  throw new InternalServerError(message);
};

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  internalError,
};
