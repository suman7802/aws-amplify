import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { ApiError, handleError } from './errors.util';
import { createResponse } from './response.util';
import { logger } from '../logger';

type HandlerFunction<T> = (
  event: APIGatewayProxyEvent,
  context: Context,
) => Promise<T>;

/**
 * Standardizes API responses and error handling for Lambda functions.
 */
export const apiHandler = <T>(handler: HandlerFunction<T>) => {
  return async (
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> => {
    try {
      const result = await handler(event, context);

      // If already a proxy result, return it
      if (
        result &&
        typeof result === 'object' &&
        'statusCode' in result &&
        'body' in result
      ) {
        return result as APIGatewayProxyResult;
      }

      // Otherwise, wrap in a success response
      return createResponse(200, { success: true, data: result }, event);
    } catch (error) {
      const apiError = handleError(error);
      return createResponse(apiError.statusCode, apiError.toJSON(), event);
    }
  };
};
