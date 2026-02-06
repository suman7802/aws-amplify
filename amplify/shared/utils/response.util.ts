import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

/**
 * Standard HTTP response headers.
 */
const BASE_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Credentials': 'true',
};

/**
 * Resolves the appropriate Access-Control-Allow-Origin header.
 */
const resolveOrigin = (event?: APIGatewayProxyEvent): string => {
  const allowedOriginsStr = process.env.ALLOWED_ORIGINS || '*';
  if (allowedOriginsStr === '*') return '*';

  const allowedOrigins = allowedOriginsStr.split(',').map((o) => o.trim());
  const requestOrigin = event?.headers?.origin || event?.headers?.Origin;

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return allowedOrigins[0] || '*';
};

/**
 * Builds standardized headers including CORS.
 */
const buildHeaders = (
  event?: APIGatewayProxyEvent,
): Record<string, string> => ({
  ...BASE_HEADERS,
  'Access-Control-Allow-Origin': resolveOrigin(event),
});

/**
 * Creates a standardized API Gateway response.
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

/**
 * Standardized success response.
 */
export const success = <T>(data: T, event?: APIGatewayProxyEvent) =>
  createResponse(200, { success: true, data }, event);

/**
 * Standardized created response.
 */
export const created = <T>(data: T, event?: APIGatewayProxyEvent) =>
  createResponse(201, { success: true, data }, event);

/**
 * Standardized no-content response.
 */
export const noContent = (event?: APIGatewayProxyEvent) =>
  createResponse(204, null, event);
