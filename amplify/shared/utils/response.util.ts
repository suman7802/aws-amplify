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
const buildHeaders = (event?: APIGatewayProxyEvent): Record<string, string> => ({
  ...BASE_HEADERS,
  'Access-Control-Allow-Origin': resolveOrigin(event),
});

/**
 * Response helper namespace.
 *
 * Provides standardized API Gateway responses with consistent structure
 * and IDE autocomplete.
 */
export class Response {
  /**
   * Creates a generic API Gateway response.
   *
   * @param statusCode - HTTP status code
   * @param body - Response payload
   * @param event - API Gateway event (used for CORS resolution)
   */
  static create<T>(statusCode: number, body: T, event?: APIGatewayProxyEvent): APIGatewayProxyResult {
    return {
      statusCode,
      headers: buildHeaders(event),
      body: JSON.stringify(body),
    };
  }

  /**
   * 200 OK response.
   *
   * @param data - Successful response data
   * @param event - API Gateway event
   */
  static success<T>(data: T, event?: APIGatewayProxyEvent): APIGatewayProxyResult {
    return this.create(200, { success: true, data }, event);
  }

  /**
   * 201 Created response.
   *
   * @param data - Created resource data
   * @param event - API Gateway event
   */
  static created<T>(data: T, event?: APIGatewayProxyEvent): APIGatewayProxyResult {
    return this.create(201, { success: true, data }, event);
  }

  /**
   * 204 No Content response.
   *
   * @param event - API Gateway event
   */
  static noContent(event?: APIGatewayProxyEvent): APIGatewayProxyResult {
    return {
      statusCode: 204,
      headers: buildHeaders(event),
      body: '',
    };
  }

  /**
   * 400 Bad Request response.
   *
   * @param data - Error response data
   * @param event - API Gateway event
   */
  static error<T>(statusCode: number, body: T, event?: APIGatewayProxyEvent): APIGatewayProxyResult {
    return this.create(statusCode, { success: false, data: body }, event);
  }
}
