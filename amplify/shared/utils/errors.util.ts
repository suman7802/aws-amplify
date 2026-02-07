import { ZodError } from 'zod';
import { logger } from '../logger';

/**
 * Represents a standardized API error.
 *
 * Used across the application to return consistent error responses
 * with HTTP status codes and machine-readable error codes.
 */
export class ApiError extends Error {
  /**
   * Creates a new ApiError instance.
   *
   * @param statusCode - HTTP status code (e.g. 400, 401, 500)
   * @param message - Human-readable error message
   * @param code - Application-specific error code
   */
  constructor(
    public statusCode: number,
    public message: string,
    public code: string = 'INTERNAL_SERVER_ERROR',
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Converts the error into a serializable JSON response.
   */
  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

/**
 * Factory class for creating common API errors.
 *
 * Provides strongly-typed helper methods and IDE autocomplete.
 */
export class Errors {
  /**
   * Creates a 400 Bad Request error.
   *
   * @param message - Description of the client error
   * @param details - Optional validation or request details
   */
  static badRequest(message = 'Bad Request', details?: unknown): ApiError {
    return new ApiError(400, message, 'BAD_REQUEST', details);
  }

  /**
   * Creates a 401 Unauthorized error.
   *
   * @param message - Authentication error message
   */
  static unauthorized(message = 'Unauthorized'): ApiError {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }

  /**
   * Creates a 403 Forbidden error.
   *
   * @param message - Authorization error message
   */
  static forbidden(message = 'Forbidden'): ApiError {
    return new ApiError(403, message, 'FORBIDDEN');
  }

  /**
   * Creates a 404 Not Found error.
   *
   * @param message - Resource not found message
   */
  static notFound(message = 'Not Found'): ApiError {
    return new ApiError(404, message, 'NOT_FOUND');
  }

  /**
   * Creates a 409 Conflict error.
   *
   * @param message - Conflict description
   * @param details - Optional conflict metadata
   */
  static conflict(message = 'Conflict', details?: unknown): ApiError {
    return new ApiError(409, message, 'CONFLICT', details);
  }

  /**
   * Creates a 500 Internal Server Error.
   *
   * @param message - Server error message
   */
  static internal(message = 'Internal Server Error'): ApiError {
    return new ApiError(500, message, 'INTERNAL_SERVER_ERROR');
  }
}

/**
 * Normalizes unknown errors into ApiError instances.
 *
 * - Returns ApiError directly if already handled
 * - Converts Zod validation errors into 400 responses
 * - Converts unknown errors into 500 responses
 *
 * @param error - Unknown error thrown during request processing
 */
export const handleError = (error: unknown): ApiError => {
  logger.error.error('Error encountered:', { error });

  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    }));

    return Errors.badRequest('Validation failed', details);
  }

  const message =
    error instanceof Error ? error.message : 'An unexpected error occurred';

  return Errors.internal(message);
};
