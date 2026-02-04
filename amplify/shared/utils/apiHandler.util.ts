import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { handleError } from './errors.util';

/**
 * Wrapper function for AWS Lambda handlers to standardize API responses and error handling.
 *
 * This higher-order function (HOF) provides:
 *  - Automatic success responses with HTTP 200
 *  - Centralized error handling via `handleError`
 *  - Consistent response structure for all Lambda functions
 *
 * @template T - Type of the successful response data
 *
 * @param handler - An async Lambda function that receives an APIGatewayProxyEvent and returns a Promise of type T
 * @returns A Lambda function compatible with AWS API Gateway that returns APIGatewayProxyResult
 *
 * @example
 * ```ts
 * import { apiHandler } from "./utils/apiHandler"
 * import { parseAndValidate } from "./utils/validation"
 * import { z } from "zod"
 *
 * const createUserSchema = z.object({
 *   name: z.string(),
 *   email: z.string().email()
 * })
 *
 * export const createUser = apiHandler(async (event) => {
 *   const body = parseAndValidate(event, createUserSchema)
 *   const user = await createUserInDB(body)
 *   return user
 * })
 * ```
 *
 * @example
 * // Automatic error handling
 * // - Throws ZodError → returns 400 with validation details
 * // - Throws ApiError → returns custom status code & message
 * // - Throws unknown error → returns 500
 *
 * @remarks
 * This pattern allows you to write Lambda handlers focusing only on **business logic**,
 * without repetitive try/catch blocks or response formatting.
 *
 * @returns APIGatewayProxyResult - The Lambda-compatible response
 */
export const apiHandler = <T>(
  handler: (event: APIGatewayProxyEvent, context: Context) => Promise<T>,
) => {
  return async (
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> => {
    try {
      const data = await handler(event, context);
      return data as APIGatewayProxyResult;
    } catch (err) {
      return handleError(err, event);
    }
  };
};
