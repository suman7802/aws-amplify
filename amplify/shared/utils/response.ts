import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

/**
 * List of allowed origins for CORS.
 * Reads from environment variable `ALLOWED_ORIGINS` (comma-separated).
 * Defaults to "*" (allow all origins) if not set.
 */
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '*')
  .split(',')
  .map((o) => o.trim());

/**
 * Resolves the appropriate Access-Control-Allow-Origin header
 * based on the incoming request headers and allowed origins.
 *
 * @param event - Optional APIGatewayProxyEvent containing request headers
 * @returns The origin to allow in CORS (string)
 */
const resolveOrigin = (event?: APIGatewayProxyEvent) => {
  const origin = event?.headers?.origin ?? event?.headers?.Origin;
  if (!origin) return '*';
  return allowedOrigins.includes('*')
    ? '*'
    : allowedOrigins.includes(origin)
      ? origin
      : '';
};

/**
 * Builds HTTP response headers, including CORS and JSON content type.
 *
 * @param event - Optional APIGatewayProxyEvent for dynamic CORS handling
 * @returns Object containing response headers
 */
const buildHeaders = (event?: APIGatewayProxyEvent) => ({
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': resolveOrigin(event),
  'Access-Control-Allow-Credentials': 'true',
});

/**
 * Creates a standardized API Gateway response.
 *
 * This function ensures consistent response structure for all Lambda handlers:
 *  - Sets HTTP status code
 *  - Adds appropriate headers (CORS, content-type)
 *  - Serializes the response body as JSON
 *
 * @template T - Type of the response body
 *
 * @param statusCode - HTTP status code (e.g., 200, 400, 500)
 * @param body - The response payload to send to the client
 * @param event - Optional APIGatewayProxyEvent for dynamic headers
 *
 * @returns APIGatewayProxyResult - Lambda-compatible response object
 *
 * @example
 * ```ts
 * return createResponse(200, { message: "Success", data: user }, event)
 * ```
 *
 * @example
 * ```ts
 * return createResponse(400, { message: "Invalid input", errors: validationErrors }, event)
 * ```
 */
export const createResponse = <T>(
  statusCode: number,
  body: T,
  event?: APIGatewayProxyEvent,
): APIGatewayProxyResult => ({
  statusCode,
  headers: buildHeaders(event),
  body: JSON.stringify(body),
});
