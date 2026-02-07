import { ZodSchema } from 'zod';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { Errors } from './errors.util';

/**
 * Validates request components using Zod schemas.
 */
export const validate = {
  /**
   * Parses and validates the request body.
   */
  body: <T>(body: string | null | undefined, schema: ZodSchema<T>): T => {
    if (!body) {
      throw Errors.badRequest('Request body is missing');
    }

    try {
      const parsedBody = JSON.parse(body);
      return schema.parse(parsedBody);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw Errors.badRequest('Invalid JSON format');
      }
      throw error;
    }
  },

  /**
   * Validates query parameters.
   */
  queryParams: <T>(event: APIGatewayProxyEvent, schema: ZodSchema<T>): T => {
    return schema.parse(event.queryStringParameters || {});
  },

  /**
   * Validates path parameters.
   */
  pathParams: <T>(event: APIGatewayProxyEvent, schema: ZodSchema<T>): T => {
    return schema.parse(event.pathParameters || {});
  },
};

/**
 * Helper to parse JSON body without throwing (internal use).
 */
export const parseBody = (event: APIGatewayProxyEvent): unknown => {
  try {
    return event.body ? JSON.parse(event.body) : null;
  } catch {
    return null;
  }
};
