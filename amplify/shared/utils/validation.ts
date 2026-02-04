import { ZodSchema } from 'zod';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { ApiError, handleError } from './errors';

/**
 * Parses and validates the JSON body of an API Gateway event using a Zod schema.
 *
 * This function ensures that:
 * 1. The request body exists.
 * 2. The request body is valid JSON.
 * 3. The request body matches the provided Zod schema.
 *
 * If any of these checks fail, an `ApiError` is thrown with the appropriate
 * HTTP status code and error details.
 *
 * @template T - The expected shape of the parsed and validated request body
 *
 * @param event - The API Gateway event containing the request
 * @param schema - A Zod schema to validate the request body against
 *
 * @returns T - The parsed and validated request body
 *
 * @throws {ApiError} - Throws if:
 *   - The request body is missing (`NO_BODY`)
 *   - The JSON is invalid (`INVALID_JSON`)
 *   - The validation fails (`VALIDATION_ERROR`)
 *
 * @example
 * ```ts
 * import { parseAndValidate } from "./validation"
 * import { z } from "zod"
 *
 * const createUserSchema = z.object({
 *   name: z.string(),
 *   email: z.string().email(),
 * })
 *
 * export const handler = apiHandler(async (event) => {
 *   const body = parseAndValidate(event, createUserSchema)
 *   const user = await createUserInDB(body)
 *   return user
 * })
 * ```
 *
 * @example
 * // Example: Missing body
 * // Throws ApiError with statusCode 400 and errorCode "request body is missing"
 *
 * @example
 * // Example: Invalid JSON
 * // Throws ApiError with statusCode 400 and errorCode "invalid json"
 *
 * @example
 * // Example: Validation error (Zod)
 * // Throws ApiError with statusCode 400 and errorCode "validation error"
 * // error.details contains array of field-specific validation issues
 */
export const parseAndValidate = <T>(event: APIGatewayProxyEvent, schema: ZodSchema<T>) => {
  if (!event.body) {
    throw new ApiError(400, 'Request body is missing');
  }

  try {
    const parsed = JSON.parse(event.body);
    return schema.parse(parsed);
  } catch (error) {
    return handleError(error, event);
  }
};
