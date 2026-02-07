import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { handleError } from './errors.util';
import { Response } from './response.util';

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

      return Response.success(result, event);
    } catch (error) {
      const apiError = handleError(error);
      return Response.error(apiError.statusCode, apiError.toJSON(), event);
    }
  };
};
