import { ZodError } from 'zod';

import { logger } from '../logger';

/**
 * Custom error class for application-specific errors.
 *
 * Use this class to throw structured errors in your Lambda handlers.
 * It allows attaching HTTP status codes and optional ext ra error details.
 *
 * @example
 * ```ts
 * throw new ApiError(403, "User is not authorized", { requiredRole: "ADMIN" })
 * ```
 */
export class ApiError extends Error {
  /**
   * @param statusCode - HTTP status code to return (e.g., 400, 403, 500)
   * @param message - Human-readable error message
   * @param errors - Optional structured details (e.g., validation errors, field errors)
   */
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Universal error handler for Lambda functions.
 *
 * Converts different types of errors into consistent API responses:
 *  - Zod validation errors → 400
 *  - ApiError instances → specified status code
 *  - Unknown/internal errors → 500
 *
 * @param error - The caught error object
 * @returns Throws an ApiError with proper status and message
 *
 * @example
 * try {
 *   // Lambda logic
 * } catch (err) {
 *   handleError(err);
 * }
 *
 */
export const handleError = (error: unknown) => {
  logger.error.error('SERVER ERROR:', { error });

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const errorList = error.issues.map((e) => ({
      code: e.code,
      message: e.message,
      field: e.path.join('.'),
    }));

    throw new ApiError(400, 'Schema validation failed', errorList);
  }

  // Handle custom application errors
  if (error instanceof ApiError) throw error;

  // Fallback for unexpected errors
  throw new ApiError(
    500,
    error instanceof Error ? error.message : String(error),
  );
};
