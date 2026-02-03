import { ZodError } from 'zod';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { createResponse } from './response';

/**
 * Custom error class for application-specific errors.
 *
 * Use this class to throw structured errors in your Lambda handlers.
 * It allows attaching HTTP status codes and optional extra error details.
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
 * Converts different types of errors into consistent API Gateway responses.
 * Handles:
 *  - Zod validation errors (returns 400)
 *  - ApiError instances (returns specified status code)
 *  - Unknown/internal errors (returns 500)
 *
 * @param error - The caught error object
 * @param event - Optional APIGatewayProxyEvent for CORS headers or logging
 * @returns APIGatewayProxyResult - formatted Lambda response
 *
 * @example
 * ```ts
 * try {
 *   // your Lambda logic
 * } catch (err) {
 *   return handleError(err, event)
 * }
 * ```
 *
 * @example
 * // Validation error
 * const schema = z.object({ email: z.string().email() })
 * try {
 *   schema.parse({ email: "invalid" })
 * } catch (err) {
 *   return handleError(err, event) // returns 400 with details
 * }
 *
 * @example
 * // ApiError
 * throw new ApiError(403, "Access denied", { requiredRole: "ADMIN" })
 * handleError(error, event) // returns 403 with message and details
 *
 * @example
 * // Unknown error
 * throw new Error("Something went wrong")
 * handleError(error, event) // returns 500
 */
export const handleError = (error: unknown, event?: APIGatewayProxyEvent) => {
  console.error('SERVER ERROR:', error);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return createResponse(
      400,
      {
        message: 'Validation Failed',
        errors: error.errors,
      },
      event,
    );
  }

  // Handle custom application errors
  if (error instanceof ApiError) {
    return createResponse(
      error.statusCode,
      {
        message: error.message,
        errors: error.errors,
      },
      event,
    );
  }

  // Fallback for unexpected errors
  return createResponse(
    500,
    {
      message: 'Internal Server Error',
      errors: error instanceof Error ? error.message : String(error),
    },
    event,
  );
};
